# Blockchain Explorer - Block API Usage

## Overview
Hệ thống explorer mới sử dụng `addBlockListener` để lắng nghe các block mới và `getTopics()` để query các block cũ từ chaincode.

## Các Hàm Chính

### 1. `getBlockchainInfo()` 
- Lấy thông tin blockchain từ peer command
- Trả về: `blockHeight`, `currentBlockHash`, `previousBlockHash`
- Sử dụng: `peer channel getinfo -c mychannel`

### 2. `setupBlockListener(network, callback)`
- Setup listener để lắng nghe các block mới
- Pattern dựa trên hàm `listenBlocks()` của bạn
- Kích hoạt callback khi có block mới

### 3. `getBlocks()` - GET `/api/explorer/blocks`
- Lấy tất cả blocks hiện tại
- Kết hợp:
  - Thông tin blockchain từ peer (block height)
  - Topics từ chaincode (dùng làm blocks)

**Response:**
```json
{
  "success": true,
  "totalBlocks": 26,
  "currentHeight": 26,
  "blocks": [
    {
      "blockNumber": 0,
      "hash": "topic_xxx",
      "previousHash": "genesis",
      "timestamp": "2025-11-15T...",
      "txCount": 1,
      "dataHash": "xxx",
      "source": "chaincode"
    }
  ],
  "blockchainInfo": {
    "blockHeight": 26,
    "currentBlockHash": "XiZqrIpmGhkDMLvQFX0j07yn/D+iL2Don2VW0e5IxgU=",
    "previousBlockHash": "EbNBikWLjhs9V2eoPAko8Ira54+h1QrDQ1qazqz0vkI="
  }
}
```

### 4. `listenBlockEvents()` - GET `/api/explorer/listen-blocks`
- **Real-time block listener** sử dụng Server-Sent Events (SSE)
- Lắng nghe các block mới khi chúng được tạo

**Cách sử dụng từ Frontend:**
```javascript
// JavaScript/React
const eventSource = new EventSource('http://localhost:3000/api/explorer/listen-blocks?x-org=org1');

eventSource.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  console.log('Block event:', data);
  
  if (data.type === 'new_block') {
    console.log(`New block: ${data.blockNumber}`);
    // Update UI
  }
});

eventSource.addEventListener('error', (error) => {
  console.error('Connection error:', error);
  eventSource.close();
});
```

**Curl Example:**
```bash
curl -N "http://localhost:3000/api/explorer/listen-blocks" \
  -H "x-org: org1" \
  -H "Accept: text/event-stream"
```

## Endpoint Reference

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/explorer/blocks` | GET | Lấy tất cả blocks |
| `/api/explorer/blocks/:blockNumber` | GET | Lấy chi tiết block |
| `/api/explorer/transactions` | GET | Lấy tất cả transactions |
| `/api/explorer/transactions/:txId` | GET | Lấy chi tiết transaction |
| `/api/explorer/peers` | GET | Lấy thông tin peers |
| `/api/explorer/peers/:peerId` | GET | Lấy chi tiết peer |
| `/api/explorer/stats` | GET | Lấy thống kê mạng |
| `/api/explorer/listen-blocks` | GET | Lắng nghe block mới (SSE) |

## Server-Sent Events Format

### Message Types:

1. **connected** - Khi kết nối thành công
```json
{"type":"connected","message":"Connected to block listener"}
```

2. **blockchain_info** - Thông tin blockchain hiện tại
```json
{
  "type":"blockchain_info",
  "blockHeight":26,
  "currentBlockHash":"XiZqrIpmGhkDMLvQFX0j07yn/D+iL2Don2VW0e5IxgU=",
  "previousBlockHash":"EbNBikWLjhs9V2eoPAko8Ira54+h1QrDQ1qazqz0vkI="
}
```

3. **new_block** - Block mới được tạo
```json
{
  "type":"new_block",
  "blockNumber":"26",
  "timestamp":"2025-11-15T10:30:45.123Z"
}
```

4. **ping** - Keep-alive signal (mỗi 30 giây)
```json
{"type":"ping"}
```

5. **error** - Lỗi xảy ra
```json
{"type":"error","message":"Error message here"}
```

## Code Pattern (Based on Your Function)

```javascript
// Original function pattern:
async function listenBlocks() {
  const ccpPath = path.resolve(__dirname, 'connection', 'connection-org1.json');
  const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
  const wallet = await Wallets.newFileSystemWallet(path.join(__dirname, 'wallet'));
  const identity = await wallet.get('appUser');

  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: 'appUser',
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork('mychannel');

  // Đăng ký listener
  await network.addBlockListener(async (event) => {
    console.log('📦=== BLOCK NEW ===📦');
    console.log(`Block Number: ${event.blockNumber.toString()}`);
    console.log(JSON.stringify(event.blockData, null, 2));
  });

  console.log('🟢 Listening for new blocks...');
}

// Đã được integrate vào: setupBlockListener() + listenBlockEvents()
```

## Testing Commands

### 1. Get all blocks:
```bash
curl -H "x-org: org1" http://localhost:3000/api/explorer/blocks
```

### 2. Listen for new blocks (in terminal):
```bash
curl -N "http://localhost:3000/api/explorer/listen-blocks?x-org=org1"
```

### 3. Get network stats:
```bash
curl -H "x-org: org1" http://localhost:3000/api/explorer/stats
```

## Integration Notes

- **getBlockchainInfo()**: Dùng `peer channel getinfo` để lấy block height thực từ blockchain
- **setupBlockListener()**: Dùng `network.addBlockListener()` để lắng nghe block mới (tương tự hàm của bạn)
- **listenBlockEvents()**: Endpoint SSE để frontend subscribe vào block updates
- **getBlocks()**: Kết hợp dữ liệu từ peer + chaincode để trả về đầy đủ thông tin

## Files Modified

- `/server/controllers/explorerController.js` - Thêm 2 hàm mới + update getBlocks()
- `/server/routes/explorerRoutes.js` - Thêm route `/listen-blocks`

