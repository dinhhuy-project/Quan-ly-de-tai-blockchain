#!/bin/bash

# Setup script để chuẩn bị wallet và connection profiles cho Topic API Server

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$(dirname "$SCRIPT_DIR")"
FABRIC_DIR="$SERVER_DIR/../../test-network"

echo "====== Topic API Server Setup ======"
echo "Server directory: $SERVER_DIR"
echo "Fabric test-network directory: $FABRIC_DIR"
echo ""

# Create directories
echo "Creating directories..."
mkdir -p "$SERVER_DIR/wallet/org1User"
mkdir -p "$SERVER_DIR/wallet/org2User"
mkdir -p "$SERVER_DIR/connection"

# Setup Org1
echo ""
echo "Setting up Org1 (Student Org)..."
ORG1_PATH="$FABRIC_DIR/organizations/peerOrganizations/org1.example.com"

# Copy connection profile
if [ -f "$ORG1_PATH/connection-org1.json" ]; then
    cp "$ORG1_PATH/connection-org1.json" "$SERVER_DIR/connection/connection-org1.json"
    echo "✓ Copied connection profile for org1"
else
    echo "⚠ Connection profile not found for org1"
fi

# Copy user certificates and keys
ORG1_USER_PATH="$ORG1_PATH/users/User1@org1.example.com/msp"
if [ -d "$ORG1_USER_PATH" ]; then
    # Copy certificate
    CERT_FILE=$(find "$ORG1_USER_PATH/signcerts" -name "*.pem" | head -1)
    if [ -f "$CERT_FILE" ]; then
        cp "$CERT_FILE" "$SERVER_DIR/wallet/org1User/cert.pem"
        echo "✓ Copied certificate for org1"
    fi

    # Copy private key
    KEY_FILE=$(find "$ORG1_USER_PATH/keystore" -name "*_sk" | head -1)
    if [ -f "$KEY_FILE" ]; then
        cp "$KEY_FILE" "$SERVER_DIR/wallet/org1User/private.key"
        echo "✓ Copied private key for org1"
    fi

    # Copy CA cert
    CA_CERT="$ORG1_PATH/peers/peer0.org1.example.com/tls/ca.crt"
    if [ -f "$CA_CERT" ]; then
        cp "$CA_CERT" "$SERVER_DIR/wallet/org1User/ca.crt"
        echo "✓ Copied CA certificate for org1"
    fi
else
    echo "⚠ User directory not found for org1"
fi

# Setup Org2
echo ""
echo "Setting up Org2 (Supervisor Org)..."
ORG2_PATH="$FABRIC_DIR/organizations/peerOrganizations/org2.example.com"

# Copy connection profile
if [ -f "$ORG2_PATH/connection-org2.json" ]; then
    cp "$ORG2_PATH/connection-org2.json" "$SERVER_DIR/connection/connection-org2.json"
    echo "✓ Copied connection profile for org2"
else
    echo "⚠ Connection profile not found for org2"
fi

# Copy user certificates and keys
ORG2_USER_PATH="$ORG2_PATH/users/User1@org2.example.com/msp"
if [ -d "$ORG2_USER_PATH" ]; then
    # Copy certificate
    CERT_FILE=$(find "$ORG2_USER_PATH/signcerts" -name "*.pem" | head -1)
    if [ -f "$CERT_FILE" ]; then
        cp "$CERT_FILE" "$SERVER_DIR/wallet/org2User/cert.pem"
        echo "✓ Copied certificate for org2"
    fi

    # Copy private key
    KEY_FILE=$(find "$ORG2_USER_PATH/keystore" -name "*_sk" | head -1)
    if [ -f "$KEY_FILE" ]; then
        cp "$KEY_FILE" "$SERVER_DIR/wallet/org2User/private.key"
        echo "✓ Copied private key for org2"
    fi

    # Copy CA cert
    CA_CERT="$ORG2_PATH/peers/peer0.org2.example.com/tls/ca.crt"
    if [ -f "$CA_CERT" ]; then
        cp "$CA_CERT" "$SERVER_DIR/wallet/org2User/ca.crt"
        echo "✓ Copied CA certificate for org2"
    fi
else
    echo "⚠ User directory not found for org2"
fi

echo ""
echo "====== Setup Complete ======"
echo ""
echo "Wallet locations:"
echo "  - Org1: $SERVER_DIR/wallet/org1User/"
echo "  - Org2: $SERVER_DIR/wallet/org2User/"
echo ""
echo "Connection profiles:"
echo "  - Org1: $SERVER_DIR/connection/connection-org1.json"
echo "  - Org2: $SERVER_DIR/connection/connection-org2.json"
echo ""
echo "Next steps:"
echo "1. Verify wallet and connection files exist"
echo "2. Update .env if needed"
echo "3. Run: npm run dev"
echo ""
