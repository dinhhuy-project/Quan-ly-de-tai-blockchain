# Topic API Server - Setup Guide

## Prerequisites

- Hyperledger Fabric test-network đã chạy
- Node.js >= 20
- npm

## Installation Steps

### 1. Cài đặt Dependencies

```bash
cd fabric-samples/chaincode/topic/server
npm install
```

### 2. Setup Wallet và Connection Profiles

Chạy script setup để copy wallet và connection profiles từ test-network:

```bash
npm run setup
```

Script này sẽ:
- Tạo thư mục `wallet/org1User/` và `wallet/org2User/`
- Tạo thư mục `connection/`
- Copy connection profiles
- Copy certificates và private keys

**Kết quả mong muốn:**
```
wallet/
  org1User/
    cert.pem
    private.key
    ca.crt
  org2User/
    cert.pem
    private.key
    ca.crt
connection/
  connection-org1.json
  connection-org2.json
```

### 3. (Tùy chọn) Enroll Users với CA

Nếu muốn tự động enroll users từ Fabric CA:

```bash
npm run enroll
```

### 4. Configure Environment

Sao chép và chỉnh sửa `.env`:

```bash
cp .env.example .env
```

Chỉnh sửa các giá trị nếu cần:
```env
PORT=3000
CHANNEL_NAME=mychannel
CHAINCODE_ID=topiccc
ORG1_MSPID=Org1MSP
ORG2_MSPID=Org2MSP
```

### 5. Chạy Server

**Development mode** (với auto-reload):
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server sẽ start tại: `http://localhost:3000`

## Verify Setup

### 1. Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "Server is running",
  "timestamp": "2025-11-15T10:30:00.000Z"
}
```

### 2. Test API Endpoint

```bash
curl http://localhost:3000/api/topics \
  -H "x-org: org1"
```

Expected response:
```json
{
  "success": true,
  "data": []
}
```

## Troubleshooting

### Error: "Wallet directory not found"

**Nguyên nhân:** Wallet chưa được setup
**Giải pháp:**
```bash
npm run setup
```

### Error: "Identity 'appUser' not found in wallet"

**Nguyên nhân:** User chưa được enroll
**Giải pháp:**
```bash
npm run enroll
```

### Error: "Connection profile not found"

**Nguyên nhân:** Connection profile chưa được copy
**Giải pháp:**
```bash
npm run setup
```

### Error: "Cannot find module 'fabric-network'"

**Nguyên nhân:** Dependencies chưa cài đặt
**Giải pháp:**
```bash
npm install
```

### Error: "Failed to connect to peer"

**Nguyên nhân:** Fabric network không chạy
**Giải pháp:**
1. Kiểm tra fabric-samples/test-network đã start
2. Verify connection profile có URL đúng
3. Kiểm tra firewall/network settings

### Error: "Chaincode not found"

**Nguyên nhân:** Chaincode `topiccc` chưa được install/instantiate
**Giải pháp:**
1. Install chaincode
2. Update `CHAINCODE_ID` trong .env nếu tên khác

## File Locations

```
server/
├── app.js                    # Main server
├── package.json
├── .env                      # Configuration
├── .env.example              # Template
│
├── wallet/
│   ├── org1User/            # Org1 identity
│   │   ├── cert.pem
│   │   ├── private.key
│   │   └── ca.crt
│   └── org2User/            # Org2 identity
│       ├── cert.pem
│       ├── private.key
│       └── ca.crt
│
├── connection/
│   ├── connection-org1.json  # Org1 connection profile
│   └── connection-org2.json  # Org2 connection profile
│
├── fabric/
│   └── fabricClient.js       # Fabric SDK wrapper
│
├── middleware/
│   └── fabricConnection.js   # Connection middleware
│
├── controllers/
│   └── topicController.js    # API handlers
│
├── routes/
│   └── topicRoutes.js        # API routes
│
├── config/
│   └── config.js             # Configuration
│
├── utils/
│   └── validators.js         # Validation
│
└── scripts/
    ├── setup.sh              # Setup script
    └── enrollUser.js         # Enroll users
```

## Using Different Organizations

### Default (Org1)

```bash
curl http://localhost:3000/api/topics
```

### Org2

```bash
curl http://localhost:3000/api/topics \
  -H "x-org: org2"
```

Middleware sẽ tự động switch connection dựa trên header `x-org`.

## Connection Flow

```
Request
   ↓
fabricConnectionMiddleware
   ├─ Lấy org từ header x-org
   ├─ Call initializeFabricConnection(org)
   │  ├─ Load wallet
   │  ├─ Load connection profile
   │  ├─ Connect to gateway
   │  └─ Get contract
   └─ Next middleware/controller
   ↓
topicController
   ├─ fabricClient.evaluateTransaction() / submitTransaction()
   └─ Response
```

## Performance Tips

1. **Reuse connections:** Middleware tự động cache connection
2. **Use queries:** Dùng `evaluateTransaction` cho read-only
3. **Batch operations:** Group multiple transactions
4. **Monitor logs:** Check logs để debug issues

## Security Notes

- ⚠️ Không commit `.env` vào git
- ⚠️ Bảo vệ wallet directory permissions
- ⚠️ Sử dụng HTTPS trong production
- ⚠️ Validate toàn bộ inputs từ client

## Next Steps

1. ✅ Setup server
2. ✅ Test health check
3. ✅ Test API endpoints
4. 📌 Implement authentication/authorization
5. 📌 Add error handling
6. 📌 Deploy to production

## Support

Xem file `API_DOCUMENTATION.md` để biết chi tiết về các API endpoints.

Xem file `README.md` để biết overview về server.
