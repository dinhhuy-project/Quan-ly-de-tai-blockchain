/**
 * Enroll admin and user with CA
 * Run this script to generate wallet identities
 */

const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

async function enrollUser(orgName, userId) {
    try {
        // Setup paths
        const walletPath = path.join(__dirname, '..', 'wallet', `${orgName}User`);
        const ccpPath = path.join(__dirname, '..', 'connection', `connection-${orgName}.json`);

        // Load connection profile
        const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
        const ccp = JSON.parse(ccpJSON);

        // Create CA client
        const caName = ccp.certificateAuthorities[Object.keys(ccp.certificateAuthorities)[0]].caName;
        const caURL = ccp.certificateAuthorities[Object.keys(ccp.certificateAuthorities)[0]].url;
        const ca = new FabricCAServices(caURL);

        console.log(`Enrolling ${userId} for ${orgName}...`);
        console.log(`CA URL: ${caURL}`);
        console.log(`CA Name: ${caName}`);

        // Create wallet
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check if user already enrolled
        const userIdentity = await wallet.get(userId);
        if (userIdentity) {
            console.log(`${userId} already enrolled in wallet`);
            return;
        }

        // Enroll admin first
        const adminId = 'admin';
        let adminIdentity = await wallet.get(adminId);

        if (!adminIdentity) {
            console.log(`Enrolling admin...`);
            const enrollment = await ca.enroll({
                enrollmentID: 'admin',
                enrollmentSecret: 'adminpw'
            });

            adminIdentity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes()
                },
                mspId: ccp.organizations[Object.keys(ccp.organizations)[0]].mspid,
                type: 'X.509'
            };

            await wallet.put(adminId, adminIdentity);
            console.log(`Admin ${adminId} enrolled successfully`);
        }

        // Enroll app user
        const adminUser = await wallet.get(adminId);
        const provider = wallet.getProviderRegistry().getProvider(adminUser.type);
        const adminContext = provider.getUserContext(adminUser, adminId);

        const secret = await ca.register({
            affiliation: `${orgName}.department1`,
            enrollmentID: userId,
            enrollmentSecret: 'userpw',
            role: 'client'
        }, adminContext);

        const enrollment = await ca.enroll({
            enrollmentID: userId,
            enrollmentSecret: secret
        });

        const userIdentity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes()
            },
            mspId: ccp.organizations[Object.keys(ccp.organizations)[0]].mspid,
            type: 'X.509'
        };

        await wallet.put(userId, userIdentity);
        console.log(`User ${userId} enrolled successfully`);
        console.log(`Wallet path: ${walletPath}`);

    } catch (error) {
        console.error(`Failed to enroll user:`, error);
        throw error;
    }
}

async function main() {
    try {
        console.log('====== Wallet Enrollment ======\n');

        // Enroll for both orgs
        await enrollUser('org1', 'appUser');
        console.log('');
        await enrollUser('org2', 'appUser');

        console.log('\n====== Enrollment Complete ======');
    } catch (error) {
        console.error('Enrollment failed:', error);
        process.exit(1);
    }
}

main();
