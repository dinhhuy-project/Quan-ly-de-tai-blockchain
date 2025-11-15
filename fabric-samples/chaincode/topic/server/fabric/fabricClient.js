const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const config = require('../config/config');

let gateway = null;
let contract = null;
let currentOrg = null;

/**
 * Initialize Fabric network connection
 */
async function initializeFabricConnection(org = 'org1') {
    try {
        // Nếu đã connect và org giống nhau, return contract
        if (contract && currentOrg === org) {
            console.log(`Using existing connection for ${org}`);
            return contract;
        }

        // Disconnect connection cũ nếu có
        if (gateway && currentOrg !== org) {
            console.log(`Switching from ${currentOrg} to ${org}`);
            await disconnect();
        }

        console.log(`Initializing Fabric network connection for ${org}...`);

        // Setup wallet
        const walletPath = path.join(__dirname, '../wallet', `${org}User`);
        console.log(`Wallet path: ${walletPath}`);

        if (!fs.existsSync(walletPath)) {
            throw new Error(`Wallet directory not found at ${walletPath}`);
        }

        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet loaded from: ${walletPath}`);

        // Check identity exists
        const identityLabel = 'appUser';
        const identity = await wallet.get(identityLabel);
        if (!identity) {
            // List available identities
            const labels = await wallet.list();
            throw new Error(
                `Identity '${identityLabel}' not found in wallet. Available: ${labels.join(', ')}`
            );
        }
        console.log(`Using identity: ${identityLabel}`);

        // Setup gateway
        gateway = new Gateway();

        // Load connection profile
        const connectionProfilePath = path.join(
            __dirname,
            '../connection',
            `connection-${org}.json`
        );

        if (!fs.existsSync(connectionProfilePath)) {
            throw new Error(`Connection profile not found at ${connectionProfilePath}`);
        }

        const connectionProfile = JSON.parse(
            fs.readFileSync(connectionProfilePath, 'utf8')
        );

        console.log(`Connection profile loaded from: ${connectionProfilePath}`);

        // Connect to gateway
        await gateway.connect(connectionProfile, {
            wallet,
            identity: identityLabel,
            discovery: { enabled: true, asLocalhost: true }
        });

        console.log('✓ Connected to gateway');

        // Get network and contract
        const network = await gateway.getNetwork(config.fabricNetworkConfig.channelName);
        console.log(`✓ Connected to channel: ${config.fabricNetworkConfig.channelName}`);

        contract = network.getContract(config.fabricNetworkConfig.chaincodeId);
        console.log(`✓ Got contract: ${config.fabricNetworkConfig.chaincodeId}`);

        currentOrg = org;
        return contract;
    } catch (error) {
        console.error('Failed to initialize Fabric connection:', error.message);
        throw error;
    }
}

/**
 * Execute a transaction on the chaincode (write operation)
 */
async function submitTransaction(functionName, ...args) {
    try {
        if (!contract) {
            throw new Error('Contract not initialized. Call initializeFabricConnection first');
        }

        console.log(`[${functionName}] Submitting transaction with args:`, args);

        const result = await contract.submitTransaction(functionName, ...args);
        const resultStr = result.toString();
        console.log(`[${functionName}] ✓ Transaction submitted successfully`);

        return resultStr;
    } catch (error) {
        console.error(`[${functionName}] Error submitting transaction:`, error.message);
        throw error;
    }
}

/**
 * Evaluate a transaction on the chaincode (read-only operation)
 */
async function evaluateTransaction(functionName, ...args) {
    try {
        if (!contract) {
            throw new Error('Contract not initialized. Call initializeFabricConnection first');
        }

        console.log(`[${functionName}] Evaluating transaction with args:`, args);

        const result = await contract.evaluateTransaction(functionName, ...args);
        const resultStr = result.toString();
        console.log(`[${functionName}] ✓ Transaction evaluated successfully`);

        return resultStr;
    } catch (error) {
        console.error(`[${functionName}] Error evaluating transaction:`, error.message);
        throw error;
    }
}

/**
 * Disconnect from gateway
 */
async function disconnect() {
    try {
        if (gateway) {
            await gateway.disconnect();
            gateway = null;
            contract = null;
            currentOrg = null;
            console.log('✓ Disconnected from gateway');
        }
    } catch (error) {
        console.error('Error disconnecting from gateway:', error.message);
    }
}

/**
 * Get current organization
 */
function getCurrentOrg() {
    return currentOrg;
}

/**
 * Get connection status
 */
function isConnected() {
    return contract !== null;
}

module.exports = {
    initializeFabricConnection,
    submitTransaction,
    evaluateTransaction,
    disconnect,
    getCurrentOrg,
    isConnected
};
