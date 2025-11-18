const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const config = require('../config/config');
const { BlockDecoder } = require('fabric-common');

// ⭐ PROTOBUF FABRIC v2.5
const fabproto6 = require('fabric-protos');

let gateway = null;
let contract = null;
let network = null;
let currentOrg = null;

/**
 * Initialize Fabric network connection
 */
async function initializeFabricConnection(org = 'org1') {
    try {
        if (contract && currentOrg === org) {
            console.log(`Using existing connection for ${org}`);
            return contract;
        }

        if (gateway && currentOrg !== org) {
            console.log(`Switching from ${currentOrg} to ${org}`);
            await disconnect();
        }

        console.log(`Initializing Fabric network connection for ${org}...`);

        const walletPath = path.join(__dirname, '../wallet', `${org}User`);
        console.log(`Wallet path: ${walletPath}`);

        if (!fs.existsSync(walletPath)) {
            throw new Error(`Wallet directory not found at ${walletPath}`);
        }

        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const identityLabel = 'appUser';
        const identity = await wallet.get(identityLabel);
        if (!identity) {
            const labels = await wallet.list();
            throw new Error(
                `Identity '${identityLabel}' not found in wallet. Available: ${labels.join(
                    ', '
                )}`
            );
        }

        gateway = new Gateway();

        const connectionProfilePath = path.join(
            __dirname,
            '../connection',
            `connection-${org}.json`
        );

        if (!fs.existsSync(connectionProfilePath)) {
            throw new Error(
                `Connection profile not found at ${connectionProfilePath}`
            );
        }

        const connectionProfile = JSON.parse(
            fs.readFileSync(connectionProfilePath, 'utf8')
        );

        await gateway.connect(connectionProfile, {
            wallet,
            identity: identityLabel,
            discovery: { enabled: true, asLocalhost: true },
        });

        console.log('✓ Connected to gateway');

        network = await gateway.getNetwork(
            config.fabricNetworkConfig.channelName
        );
        console.log(
            `✓ Connected to channel: ${config.fabricNetworkConfig.channelName}`
        );

        contract = network.getContract(config.fabricNetworkConfig.chaincodeId);
        console.log(
            `✓ Got contract: ${config.fabricNetworkConfig.chaincodeId}`
        );

        currentOrg = org;
        return contract;
    } catch (error) {
        console.error('Failed to initialize Fabric connection:', error.message);
        throw error;
    }
}

/** Submit transaction */
async function submitTransaction(functionName, ...args) {
    try {
        if (!contract) throw new Error('Contract not initialized.');

        const result = await contract.submitTransaction(functionName, ...args);
        return result.toString();
    } catch (error) {
        console.error(
            `[${functionName}] Error submitting transaction:`,
            error.message
        );
        throw error;
    }
}

/** Evaluate transaction */
async function evaluateTransaction(functionName, ...args) {
    try {
        if (!contract) throw new Error('Contract not initialized.');

        const result = await contract.evaluateTransaction(
            functionName,
            ...args
        );
        return result.toString();
    } catch (error) {
        console.error(
            `[${functionName}] Error evaluating transaction:`,
            error.message
        );
        throw error;
    }
}

/** Disconnect gateway */
async function disconnect() {
    try {
        if (gateway) {
            await gateway.disconnect();
            gateway = null;
            contract = null;
            network = null;
            currentOrg = null;
            console.log('✓ Disconnected from gateway');
        }
    } catch (error) {
        console.error('Error disconnecting:', error.message);
    }
}

function getCurrentOrg() {
    return currentOrg;
}

function isConnected() {
    return contract !== null;
}

/* -------------------------------------------
   ⭐ DECODE BLOCK FROM PROTOBUF
----------------------------------------------*/
function decodeBlock(buffer) {
    try {
        return fabproto6.common.Block.decode(buffer);
    } catch (e) {
        console.error('❌ Failed to decode block:', e);
        return null;
    }
}

/* -------------------------------------------
   ⭐ Get blockchain info via QSCC
----------------------------------------------*/
async function getBlockchainInfo() {
    if (!network) throw new Error('Fabric not connected.');

    const qscc = network.getContract('qscc');

    const result = await qscc.evaluateTransaction(
        'GetChainInfo',
        network.getChannel().name
    );

    const blockInfo = fabproto6.common.BlockchainInfo.decode(result);

    return {
        height: blockInfo.height,
        currentBlockHash: blockInfo.currentBlockHash.toString('hex'),
        previousBlockHash: blockInfo.previousBlockHash.toString('hex'),
    };
}

/* -------------------------------------------
   ⭐ Get block by number
----------------------------------------------*/
async function getBlockByNumber(blockNumber) {
    if (!network) throw new Error('Fabric not connected.');

    const qscc = network.getContract('qscc');

    const result = await qscc.evaluateTransaction(
        'GetBlockByNumber',
        network.getChannel().name,
        blockNumber.toString()
    );

    return decodeBlock(result);
}

/* -------------------------------------------
   ⭐ Get all blocks
----------------------------------------------*/
async function getAllBlocks() {
    const info = await getBlockchainInfo();
    const height = info.height.low || info.height; // height is Long object

    const blocks = [];

    for (let i = 0; i < height; i++) {
        console.log(`⏳ Loading block ${i}/${height - 1}`);
        const block = await getBlockByNumber(i);
        blocks.push(block);
    }

    return blocks;
}

/**
 * Get all transactions in the blockchain
 */
const protobuf = require('protobufjs');

async function loadProto() {
    const root = new protobuf.Root();
    await root.load(
        [
            path.join(__dirname, 'protos/fabric-protos/'),
        ],
        { keepCase: true }
    );

    return root;
}
async function parseBlock25(block, root) {
    let txList = [];

    if (!block || !block.data || !block.data.data) return txList;

    for (const envelopeBytes of block.data.data) {
        try {
            const Envelope = root.lookupType('common.Envelope');
            const Payload = root.lookupType('common.Payload');
            const ChannelHeader = root.lookupType('common.ChannelHeader');

            const env = Envelope.decode(envelopeBytes);
            const payload = Payload.decode(env.payload);
            const ch = ChannelHeader.decode(payload.header.channel_header);

            // Lọc đúng type giao dịch ENDORSER_TRANSACTION
            if (ch.type === 3) {
                txList.push({
                    txId: ch.tx_id,
                    timestamp: ch.timestamp,
                    channel: ch.channel_id,
                    type: 'ENDORSE_TRANSACTION',
                });
            }
        } catch (err) {
            console.log('⚠ Skip decode due to:', err.message);
        }
    }

    return txList;
}
async function getAllTransactions() {
    if (!contract) throw new Error('Fabric not connected.');

    const network = contract.network;
    const qscc = network.getContract('qscc');
    const channelName = network.getChannel().name;

    // Load protobuf root
    const root = await loadProto();

    // Lấy blockchain info
    const infoBytes = await qscc.evaluateTransaction(
        'GetChainInfo',
        channelName
    );
    const BlockchainInfo = root.lookupType('common.BlockchainInfo');
    const info = BlockchainInfo.decode(infoBytes);

    const height = info.height.toNumber();
    console.log('📦 Blockchain Height:', height);

    let allTx = [];

    for (let i = 0; i < height; i++) {
        console.log(`📥 Reading block ${i} ...`);
        try {
            const blockBytes = await qscc.evaluateTransaction(
                'GetBlockByNumber',
                channelName,
                String(i)
            );

            const Block = root.lookupType('common.Block');
            const block = Block.decode(blockBytes);

            const txList = await parseBlock25(block, root);
            allTx.push(...txList);
        } catch (err) {
            console.log(`❌ Failed block ${i}:`, err.message);
        }
    }

    console.log(`✅ Total TX: ${allTx.length}`);

    return allTx;
}

module.exports = {
    initializeFabricConnection,
    submitTransaction,
    evaluateTransaction,
    disconnect,
    getCurrentOrg,
    isConnected,
    getBlockchainInfo,
    getBlockByNumber,
    getAllBlocks,
    getAllTransactions,
};
