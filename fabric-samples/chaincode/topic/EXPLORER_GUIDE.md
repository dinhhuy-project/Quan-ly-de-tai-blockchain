# Blockchain Explorer - Hướng Dẫn Sử Dụng

## 📋 Tổng Quan

Blockchain Explorer là công cụ trực quan hóa được tích hợp sẵn trong hệ thống quản lý đề tài blockchain, cho phép người dùng xem và theo dõi:

- **Blocks (Khối)**: Tất cả các khối trong blockchain
- **Transactions (Giao dịch)**: Danh sách các giao dịch đã xác nhận
- **Peers (Nút mạng)**: Các nút mạng và trạng thái của chúng
- **Network Statistics**: Thống kê mạng lưới

## 🎯 Tính Năng Chính

### 1. **Network Statistics (Thống Kê Mạng)**
- Hiển thị thông tin tổng quát về mạng blockchain
- Tổng số block hiện tại
- Tổng số peer
- Tổng hash của block mới nhất
- Cập nhật tự động mỗi 5 giây

### 2. **Blocks (Khối)**
Xem danh sách tất cả các khối:
- **Block Number**: Số thứ tự khối
- **Hash**: Mã băm duy nhất của khối
- **Previous Hash**: Mã băm của khối trước đó
- **Transactions**: Số lượng giao dịch trong khối
- Nhấp vào từng khối để xem chi tiết

### 3. **Transactions (Giao Dịch)**
Theo dõi tất cả giao dịch:
- **Transaction ID**: Mã định danh duy nhất
- **Block**: Khối chứa giao dịch
- **Type**: Loại giao dịch
- **Time**: Thời gian giao dịch
- **Status**: Trạng thái (Valid/Invalid)
- Nhấp để xem chi tiết chi tiết giao dịch

### 4. **Network Peers (Nút Mạng)**
Giám sát các nút mạng:
- **Peer ID**: Mã định danh nút
- **Name**: Tên nút mạng
- **URL**: Địa chỉ của nút
- **Organization**: Tổ chức sở hữu nút
- **Status**: Trạng thái kết nối (Active/Inactive)
- Nhấp để xem chi tiết nút

## 📱 Giao Diện

### Tab Navigation (Thanh Điều Hướng)

```
┌─────────────────────────────────────────┐
│ Overview | Blocks | Transactions | Peers │
└─────────────────────────────────────────┘
```

#### **Overview Tab (Tab Tổng Quan)**
- Hiển thị thống kê mạng
- Thông tin về công cụ
- Nút điều hướng nhanh

#### **Blocks Tab (Tab Khối)**
- Bảng danh sách tất cả khối
- Cập nhật tự động mỗi 10 giây
- Nhấp vào dòng để xem chi tiết

#### **Transactions Tab (Tab Giao Dịch)**
- Bảng danh sách giao dịch gần đây
- Cập nhật tự động mỗi 10 giây
- Thông tin chi tiết cho từng giao dịch

#### **Peers Tab (Tab Nút)**
- Hiển thị dạng lưới các nút mạng
- Thông tin trạng thái kết nối
- Cập nhật tự động mỗi 15 giây

## 🔍 Chi Tiết Thông Tin

### Block Details Modal (Cửa Sổ Chi Tiết Khối)

Khi nhấp vào một khối, hiển thị:

```json
{
  "blockNumber": 1,
  "hash": "abc123...",
  "previousHash": "def456...",
  "dataHash": "ghi789...",
  "timestamp": "2024-11-15T10:30:00Z",
  "txCount": 5
}
```

### Transaction Details Modal (Cửa Sổ Chi Tiết Giao Dịch)

```json
{
  "txId": "tx_001",
  "blockNumber": 1,
  "type": "endorser_transaction",
  "timestamp": "2024-11-15T10:30:00Z",
  "valid": true,
  "validationCode": 0
}
```

### Peer Details Modal (Cửa Sổ Chi Tiết Nút)

```json
{
  "peerId": "peer0",
  "name": "peer0.org1.example.com",
  "url": "grpcs://localhost:7051",
  "status": "Active",
  "mspId": "ORG1",
  "ledgerHeight": 10,
  "currentBlockHash": "abc123..."
}
```

## 🔄 Tự Động Cập Nhật

Explorer tự động cập nhật dữ liệu:

| Thành Phần | Khoảng Cập Nhật |
|-----------|-----------------|
| Network Stats | 5 giây |
| Blocks | 10 giây |
| Transactions | 10 giây |
| Peers | 15 giây |

Bạn cũng có thể nhấp nút **Refresh** (biểu tượng tuần hoàn) để cập nhật thủ công.

## 🛠️ Công Nghệ Sử Dụng

### Backend (Node.js/Express)

**API Endpoints:**

```
GET  /api/explorer/blocks              - Lấy danh sách khối
GET  /api/explorer/blocks/:blockNumber - Chi tiết khối
GET  /api/explorer/transactions        - Lấy danh sách giao dịch
GET  /api/explorer/transactions/:txId  - Chi tiết giao dịch
GET  /api/explorer/peers               - Lấy danh sách nút
GET  /api/explorer/peers/:peerId       - Chi tiết nút
GET  /api/explorer/stats               - Thống kê mạng
```

**Headers:**

```
x-org: org1 (hoặc org2)
```

### Frontend (React + TypeScript)

**Components:**

- `NetworkStatsCard.tsx` - Hiển thị thống kê mạng
- `BlocksTable.tsx` - Danh sách khối
- `TransactionsTable.tsx` - Danh sách giao dịch
- `PeersList.tsx` - Danh sách nút
- `BlockDetailModal.tsx` - Chi tiết khối
- `TransactionDetailModal.tsx` - Chi tiết giao dịch
- `PeerDetailModal.tsx` - Chi tiết nút

**Services:**

- `explorerService.ts` - Gọi API explorer

## 📊 Ví Dụ Sử Dụng

### 1. Xem Danh Sách Khối

```bash
# Request
curl -H "x-org: org1" http://localhost:3000/api/explorer/blocks

# Response
{
  "success": true,
  "totalBlocks": 10,
  "currentHeight": 10,
  "blocks": [
    {
      "blockNumber": 9,
      "hash": "abc123...",
      "previousHash": "def456...",
      "txCount": 3,
      "dataHash": "ghi789..."
    },
    ...
  ]
}
```

### 2. Xem Chi Tiết Khối

```bash
# Request
curl -H "x-org: org1" http://localhost:3000/api/explorer/blocks/5

# Response
{
  "success": true,
  "block": {
    "blockNumber": 5,
    "hash": "abc123...",
    "previousHash": "def456...",
    "timestamp": "2024-11-15T10:30:00Z",
    "txCount": 2,
    "transactions": [
      {
        "index": 0,
        "txId": "tx_001",
        "type": "ENDORSER_TRANSACTION",
        "timestamp": "2024-11-15T10:30:00Z"
      }
    ]
  }
}
```

### 3. Xem Danh Sách Nút

```bash
# Request
curl -H "x-org: org1" http://localhost:3000/api/explorer/peers

# Response
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
    }
  ]
}
```

## 🚀 Khởi Động Explorer

### 1. Khởi Động Backend Server

```bash
cd fabric-samples/chaincode/topic/server
npm install
npm run dev
```

Server sẽ chạy tại `http://localhost:3000`

### 2. Khởi Động Frontend Client

```bash
cd fabric-samples/chaincode/topic/client
npm install
npm run dev
```

Client sẽ chạy tại `http://localhost:5173`

### 3. Truy Cập Explorer

1. Đăng nhập vào ứng dụng
2. Nhấp vào biểu tượng **Activity** (📊) trong header
3. Hoặc điều hướng đến `/explorer`

## 🔐 Bảo Mật

- Explorer yêu cầu xác thực (Protected Route)
- Chỉ người dùng đã đăng nhập mới có thể truy cập
- Dữ liệu được truy xuất thông qua API an toàn
- Organization ID (x-org) được gửi cùng mỗi request

## 📈 Hiệu Năng

- **Lazy Loading**: Dữ liệu được tải khi cần
- **Auto-refresh**: Cập nhật dữ liệu định kỳ
- **Pagination**: Hiển thị 50 khối gần nhất
- **Caching**: Tối ưu hóa API calls

## ❓ Câu Hỏi Thường Gặp

### Q: Tại sao explorer không hiển thị dữ liệu?

**A:** Kiểm tra:
1. Backend server đang chạy
2. Bạn đã đăng nhập
3. Header `x-org` được gửi chính xác
4. Fabric network đang chạy

### Q: Dữ liệu cập nhật bao lâu?

**A:** 
- Network Stats: 5 giây
- Blocks/Transactions: 10 giây
- Peers: 15 giây

### Q: Có thể cập nhật thủ công không?

**A:** Có, nhấp nút **Refresh** (🔄) trên mỗi thẻ.

### Q: Explorer có hỗ trợ nhiều organization không?

**A:** Có, thay đổi header `x-org` trong API calls hoặc sửa trong environment variables.

## 📝 Các Giới Hạn

- Chỉ hiển thị 50 khối gần nhất
- Dữ liệu lịch sử được lưu trên blockchain
- Không thể chỉnh sửa dữ liệu blockchain (immutable)
- Thời gian response phụ thuộc vào hiệu năng network

## 🔧 Troubleshooting

### Lỗi: "Failed to connect to channel or peer"

```javascript
// Kiểm tra fabricClient.js
// Đảm bảo connection config chính xác
```

### Lỗi: "Cannot find module"

```bash
# Reinstall dependencies
npm install
```

### Dữ liệu không cập nhật

```javascript
// Kiểm tra trong DevTools Console
// Xem có error từ API không
```

## 📚 Tài Liệu Liên Quan

- [Hyperledger Fabric Documentation](https://hyperledger-fabric.readthedocs.io/)
- [Fabric Network API](https://hyperledger.github.io/fabric-sdk-node/)
- [React Documentation](https://react.dev/)

## 🤝 Hỗ Trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra logs trong DevTools (F12)
2. Kiểm tra server logs
3. Đảm bảo tất cả services đang chạy

---

**Version**: 1.0.0  
**Last Updated**: November 15, 2024
