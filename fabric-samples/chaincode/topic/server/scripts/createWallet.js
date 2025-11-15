#!/usr/bin/env node

/**
 * Create wallet identities from existing cert and key files
 */

const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function createWalletIdentity(org) {
    try {
        console.log(`\n====== Creating wallet for ${org.toUpperCase()} ======`);

        const walletPath = path.join(__dirname, '..', 'wallet', `${org}User`);
        const certPath = path.join(walletPath, 'cert.pem');
        const keyPath = path.join(walletPath, 'private.key');
        const connectionPath = path.join(__dirname, '..', 'connection', `connection-${org}.json`);

        // Check files exist
        if (!fs.existsSync(certPath)) {
            throw new Error(`Certificate not found at ${certPath}`);
        }
        if (!fs.existsSync(keyPath)) {
            throw new Error(`Private key not found at ${keyPath}`);
        }
        if (!fs.existsSync(connectionPath)) {
            throw new Error(`Connection profile not found at ${connectionPath}`);
        }

        console.log(`✓ Found cert: ${certPath}`);
        console.log(`✓ Found key: ${keyPath}`);

        // Read certificate and key
        const cert = fs.readFileSync(certPath, 'utf8');
        const key = fs.readFileSync(keyPath, 'utf8');
        const connectionProfile = JSON.parse(fs.readFileSync(connectionPath, 'utf8'));

        // Get MSP ID from connection profile
        const orgName = Object.keys(connectionProfile.organizations)[0];
        const mspId = connectionProfile.organizations[orgName].mspid;

        console.log(`✓ MSP ID: ${mspId}`);

        // Create wallet
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Create identity
        const identity = {
            credentials: {
                certificate: cert,
                privateKey: key
            },
            mspId: mspId,
            type: 'X.509'
        };

        // Import identity to wallet
        const identityName = 'appUser';
        await wallet.put(identityName, identity);

        console.log(`✓ Identity '${identityName}' added to wallet`);
        console.log(`✓ Wallet path: ${walletPath}`);

        return true;
    } catch (error) {
        console.error(`✗ Error creating wallet for ${org}:`, error.message);
        throw error;
    }
}

async function main() {
    try {
        console.log('====== Wallet Setup ======\n');
        console.log('Creating wallet identities from certificates...\n');

        // Setup Org1
        await createWalletIdentity('org1');

        // Setup Org2
        await createWalletIdentity('org2');

        console.log('\n✓ ====== Wallet Setup Complete ======\n');
        console.log('You can now start the server with: npm run dev\n');

    } catch (error) {
        console.error('\n✗ ====== Wallet Setup Failed ======\n');
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { createWalletIdentity };
