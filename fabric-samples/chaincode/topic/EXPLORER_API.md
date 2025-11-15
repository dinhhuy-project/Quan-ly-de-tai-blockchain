# Blockchain Explorer API - Tài Liệu Kỹ Thuật

## 📡 Base URL

```
http://localhost:3000/api/explorer
```

## 🔐 Authentication

Tất cả các endpoint yêu cầu:
- **User Authentication**: Token JWT từ session
- **Header**: `x-org` (org1 hoặc org2)

```bash
# Example
curl -H "x-org: org1" \
     -H "Authorization: Bearer <token>" \
     http://localhost:3000/api/explorer/blocks
```

## 📋 Endpoints

### 1. GET /blocks

Lấy danh sách tất cả các khối

**Request:**
```bash
GET /api/explorer/blocks
Header: x-org: org1
```

**Response (200 OK):**
```json
{
  "success": true,
  "totalBlocks": 10,
  "currentHeight": 10,
  "blocks": [
    {
      "blockNumber": 9,
      "hash": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      "previousHash": "z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4",
      "timestamp": "2024-11-15T10:30:00Z",
      "txCount": 3,
      "dataHash": "1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p"
    },
    {
      "blockNumber": 8,
      "hash": "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7",
      "previousHash": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      "timestamp": "2024-11-15T10:25:00Z",
      "txCount": 2,
      "dataHash": "2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q"
    }
  ]
}
```

**Error Response (400):**
```json
{
  "error": "Failed to connect to channel or peer"
}
```

**Error Response (500):**
```json
{
  "error": "Failed to fetch blocks",
  "details": "Error message details"
}
```

---

### 2. GET /blocks/:blockNumber

Lấy chi tiết của một khối cụ thể

**Request:**
```bash
GET /api/explorer/blocks/5
Header: x-org: org1
```

**Response (200 OK):**
```json
{
  "success": true,
  "block": {
    "blockNumber": 5,
    "hash": "c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8",
    "previousHash": "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7",
    "timestamp": "2024-11-15T10:15:00Z",
    "txCount": 4,
    "dataHash": "3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r",
    "transactions": [
      {
        "index": 0,
        "txId": "tx_001_abc123",
        "type": "ENDORSER_TRANSACTION",
        "timestamp": "2024-11-15T10:15:00Z"
      },
      {
        "index": 1,
        "txId": "tx_002_def456",
        "type": "ENDORSER_TRANSACTION",
        "timestamp": "2024-11-15T10:15:01Z"
      },
      {
        "index": 2,
        "txId": "tx_003_ghi789",
        "type": "ENDORSER_TRANSACTION",
        "timestamp": "2024-11-15T10:15:02Z"
      },
      {
        "index": 3,
        "txId": "tx_004_jkl012",
        "type": "ENDORSER_TRANSACTION",
        "timestamp": "2024-11-15T10:15:03Z"
      }
    ]
  }
}
```

**Error Response (404):**
```json
{
  "error": "Block not found"
}
```

---

### 3. GET /transactions

Lấy danh sách tất cả các giao dịch

**Request:**
```bash
GET /api/explorer/transactions
Header: x-org: org1
```

**Response (200 OK):**
```json
{
  "success": true,
  "totalTransactions": 15,
  "transactions": [
    {
      "txId": "tx_015_mno345",
      "blockNumber": 9,
      "type": "ENDORSER_TRANSACTION",
      "timestamp": "2024-11-15T10:30:00Z",
      "status": "Valid"
    },
    {
      "txId": "tx_014_lmn234",
      "blockNumber": 8,
      "type": "ENDORSER_TRANSACTION",
      "timestamp": "2024-11-15T10:25:00Z",
      "status": "Valid"
    },
    {
      "txId": "tx_013_klm123",
      "blockNumber": 8,
      "type": "ENDORSER_TRANSACTION",
      "timestamp": "2024-11-15T10:24:59Z",
      "status": "Valid"
    }
  ]
}
```

---

### 4. GET /transactions/:txId

Lấy chi tiết của một giao dịch cụ thể

**Request:**
```bash
GET /api/explorer/transactions/tx_001_abc123
Header: x-org: org1
```

**Response (200 OK):**
```json
{
  "success": true,
  "transaction": {
    "txId": "tx_001_abc123",
    "blockNumber": 5,
    "valid": true,
    "validationCode": 0,
    "timestamp": "2024-11-15T10:15:00Z"
  }
}
```

**Validation Codes:**
- `0`: VALID
- `1`: NIL_ENVELOPE
- `2`: BAD_PAYLOAD
- `3`: BAD_ENDORSER_SIG
- Etc.

---

### 5. GET /peers

Lấy danh sách tất cả các nút mạng

**Request:**
```bash
GET /api/explorer/peers
Header: x-org: org1
```

**Response (200 OK):**
```json
{
  "success": true,
  "totalPeers": 2,
  "peers": [
    {
      "peerId": "peer0",
      "name": "peer0.org1.example.com",
      "url": "grpcs://localhost:7051",
      "status": "Active",
      "mspId": "ORG1"
    },
    {
      "peerId": "peer1",
      "name": "peer1.org1.example.com",
      "url": "grpcs://localhost:8051",
      "status": "Active",
      "mspId": "ORG1"
    }
  ]
}
```

**Error Response:**
```json
{
  "success": true,
  "peers": [],
  "message": "No peers found"
}
```

---

### 6. GET /peers/:peerId

Lấy chi tiết của một nút mạng cụ thể

**Request:**
```bash
GET /api/explorer/peers/peer0
Header: x-org: org1
```

**Response (200 OK):**
```json
{
  "success": true,
  "peer": {
    "peerId": "peer0",
    "name": "peer0.org1.example.com",
    "url": "grpcs://localhost:7051",
    "status": "Active",
    "mspId": "ORG1",
    "ledgerHeight": 10,
    "currentBlockHash": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
  }
}
```

---

### 7. GET /stats

Lấy thống kê mạng lưới

**Request:**
```bash
GET /api/explorer/stats
Header: x-org: org1
```

**Response (200 OK):**
```json
{
  "success": true,
  "stats": {
    "channelName": "mychannel",
    "totalBlocks": 10,
    "totalPeers": 2,
    "mspId": "ORG1",
    "latestBlockHash": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    "timestamp": "2024-11-15T10:30:00Z"
  }
}
```

---

## 🔄 Rate Limiting

Không có rate limiting cụ thể, nhưng khuyến nghị:

- **Network Stats**: Tối đa 1 request/5 giây
- **Blocks/Transactions**: Tối đa 1 request/10 giây
- **Peers**: Tối đa 1 request/15 giây

---

## 📊 Data Types

### Block Object

```typescript
interface Block {
  blockNumber: number;
  hash: string;
  previousHash: string;
  timestamp: string;
  txCount: number;
  dataHash: string;
}
```

### Transaction Object

```typescript
interface Transaction {
  txId: string;
  blockNumber: number;
  type: string;
  timestamp: string;
  status: string;
}
```

### Peer Object

```typescript
interface Peer {
  peerId: string;
  name: string;
  url: string;
  status: 'Active' | 'Inactive';
  mspId: string;
}
```

### PeerDetails Object

```typescript
interface PeerDetails extends Peer {
  ledgerHeight: number;
  currentBlockHash: string;
}
```

### NetworkStats Object

```typescript
interface NetworkStats {
  channelName: string;
  totalBlocks: number;
  totalPeers: number;
  mspId: string;
  latestBlockHash: string;
  timestamp: string;
}
```

---

## ⚠️ Error Handling

### HTTP Status Codes

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | Success | `{"success": true, "data": {...}}` |
| 400 | Bad Request | Missing required headers |
| 404 | Not Found | Block/Transaction not found |
| 500 | Server Error | Fabric network error |

### Common Errors

**1. Missing Organization Header**
```json
{
  "error": "Failed to connect to channel or peer",
  "details": "Organization header missing"
}
```

**2. Invalid Block Number**
```json
{
  "error": "Failed to fetch block details",
  "details": "Block number out of range"
}
```

**3. Network Connection Error**
```json
{
  "error": "Failed to fetch blocks",
  "details": "ECONNREFUSED 127.0.0.1:7051"
}
```

---

## 🧪 cURL Examples

### Get All Blocks
```bash
curl -H "x-org: org1" \
     http://localhost:3000/api/explorer/blocks
```

### Get Block #5
```bash
curl -H "x-org: org1" \
     http://localhost:3000/api/explorer/blocks/5
```

### Get All Transactions
```bash
curl -H "x-org: org1" \
     http://localhost:3000/api/explorer/transactions
```

### Get Transaction Details
```bash
curl -H "x-org: org1" \
     http://localhost:3000/api/explorer/transactions/tx_001_abc123
```

### Get All Peers
```bash
curl -H "x-org: org1" \
     http://localhost:3000/api/explorer/peers
```

### Get Peer Details
```bash
curl -H "x-org: org1" \
     http://localhost:3000/api/explorer/peers/peer0
```

### Get Network Stats
```bash
curl -H "x-org: org1" \
     http://localhost:3000/api/explorer/stats
```

---

## 📡 WebSocket Support

Hiện tại không hỗ trợ WebSocket. Auto-refresh được thực hiện bằng polling.

---

## 🔒 Security Considerations

1. **API Keys**: Không sử dụng API keys, rely on JWT tokens
2. **HTTPS**: Nên sử dụng HTTPS trong production
3. **CORS**: Được cấu hình cho frontend tại localhost:5173
4. **Organization Isolation**: Dữ liệu được lọc theo organization

---

## 🚀 Performance Optimization

### Backend

```javascript
// Caching responses
const cache = new Map();
const TTL = 5000; // 5 seconds

// Limit block fetch
const maxBlocksReturned = 50;
```

### Frontend

```typescript
// Auto-refresh intervals
const STATS_REFRESH = 5000;
const BLOCKS_REFRESH = 10000;
const PEERS_REFRESH = 15000;

// Lazy loading
const blocks = await fetchBlocks();
```

---

## 📈 Scalability

- **Supports multiple organizations**: org1, org2, etc.
- **Handles large ledgers**: Query only recent blocks (50+)
- **Efficient peer queries**: Batch peer operations

---

**API Version**: 1.0.0  
**Last Updated**: November 15, 2024  
**Maintenance**: Technology Team
