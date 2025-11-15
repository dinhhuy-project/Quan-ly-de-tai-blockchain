# 🚀 Blockchain Explorer - Hướng Dẫn Nhanh Bắt Đầu

## ✅ Yêu Cầu Trước

- Node.js v14 trở lên
- Hyperledger Fabric network đang chạy
- Fabric SDK đã được cài đặt

## 📦 Cài Đặt

### 1. Backend Server

```bash
# Đi tới folder server
cd fabric-samples/chaincode/topic/server

# Cài đặt dependencies
npm install

# Tạo file .env (nếu chưa có)
cp .env.example .env

# Chạy server
npm run dev
```

Server sẽ chạy tại: **http://localhost:3000**

### 2. Frontend Client

```bash
# Đi tới folder client
cd fabric-samples/chaincode/topic/client

# Cài đặt dependencies
npm install

# Tạo file .env (nếu chưa có)
cp .env.example .env

# Chạy client
npm run dev
```

Client sẽ chạy tại: **http://localhost:5173**

## 🎯 Sử Dụng

### 1. Mở Ứng Dụng

```
http://localhost:5173
```

### 2. Đăng Nhập

- **Username**: student1 (hoặc supervisor1)
- **Password**: password123

### 3. Truy Cập Explorer

**Cách 1**: Nhấp biểu tượng **Activity** (📊) trong header

**Cách 2**: Điều hướng trực tiếp đến:
```
http://localhost:5173/explorer
```

## 📚 Tính Năng Chính

### Overview Tab
```
├── Network Statistics
│   ├── Channel Name
│   ├── Total Blocks
│   ├── Total Peers
│   └── Latest Block Hash
├── About Explorer
└── Quick Navigation
```

### Blocks Tab
```
├── Danh sách tất cả blocks
├── Hiển thị chi tiết:
│   ├── Block Number
│   ├── Hash
│   ├── Previous Hash
│   └── Transaction Count
└── Nhấp để xem chi tiết
```

### Transactions Tab
```
├── Danh sách giao dịch
├── Hiển thị chi tiết:
│   ├── Transaction ID
│   ├── Block Number
│   ├── Type
│   ├── Time
│   └── Status
└── Nhấp để xem chi tiết
```

### Peers Tab
```
├── Danh sách nút mạng
├── Hiển thị chi tiết:
│   ├── Peer ID
│   ├── Name
│   ├── URL
│   ├── Organization
│   └── Status
└── Nhấp để xem chi tiết
```

## 🔄 Auto-Refresh

| Tab | Khoảng Cập Nhật |
|-----|-----------------|
| Network Stats | 5 giây |
| Blocks | 10 giây |
| Transactions | 10 giây |
| Peers | 15 giây |

## 💡 Ví Dụ Workflow

### 1. Theo Dõi Blocks Mới

```
1. Đi tới "Blocks" tab
2. Explorer tự động cập nhật mỗi 10 giây
3. Nhấp vào block để xem chi tiết
4. Xem danh sách transactions trong block
```

### 2. Kiểm Tra Giao Dịch

```
1. Đi tới "Transactions" tab
2. Tìm giao dịch cần kiểm tra
3. Nhấp vào dòng transaction
4. Xem chi tiết transaction
```

### 3. Giám Sát Peers

```
1. Đi tới "Peers" tab
2. Kiểm tra trạng thái mỗi peer
3. Nhấp vào peer để xem chi tiết
4. Kiểm tra ledger height và block hash
```

## 🆘 Troubleshooting

### Vấn Đề: Explorer không tải dữ liệu

**Giải pháp:**
```bash
# 1. Kiểm tra server chạy
ps aux | grep "node app.js"

# 2. Kiểm tra fabric network chạy
docker ps | grep fabric

# 3. Xem logs
tail -f server.log

# 4. Restart server
npm run dev
```

### Vấn Đề: Dữ liệu cũ, không cập nhật

**Giải pháp:**
```bash
# Nhấp nút Refresh (🔄) trên mỗi thẻ
# hoặc tải lại trang (F5)
```

### Vấn Đề: Lỗi "Failed to connect to peer"

**Giải pháp:**
```bash
# Kiểm tra fabric network
docker-compose ps

# Restart network
docker-compose down
docker-compose up -d
```

## 📝 Logs

### Server Logs

```bash
# Xem tất cả logs
npm run dev

# Hoặc trong file (nếu có)
cat server.log
```

### Client Logs

```bash
# Mở DevTools (F12)
# Xem Console tab
```

## 🔧 Configuration

### Backend (.env)

```env
PORT=3000
FABRIC_CONFIG_PATH=./config
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
```

## 📊 API Test

### Test Block API

```bash
curl -H "x-org: org1" \
     http://localhost:3000/api/explorer/blocks
```

### Test Stats API

```bash
curl -H "x-org: org1" \
     http://localhost:3000/api/explorer/stats
```

### Test Peers API

```bash
curl -H "x-org: org1" \
     http://localhost:3000/api/explorer/peers
```

## 🎓 Học Thêm

1. **Hyperledger Fabric**: https://hyperledger-fabric.readthedocs.io/
2. **Blockchain Basics**: Xem tài liệu chính
3. **API Documentation**: Xem `EXPLORER_API.md`

## 📋 Checklist Khởi Động

- [ ] Node.js đã cài đặt
- [ ] Fabric network chạy
- [ ] Dependencies đã install
- [ ] Backend server chạy (port 3000)
- [ ] Frontend client chạy (port 5173)
- [ ] Đăng nhập thành công
- [ ] Explorer hiển thị dữ liệu

## 🚀 Next Steps

1. **Tạo Topics**: Đi tới Homepage để tạo topic
2. **Theo dõi Blockchain**: Xem dữ liệu real-time trong Explorer
3. **Phân tích**: Kiểm tra blocks, transactions, peers

## 💬 Hỗ Trợ

- Kiểm tra docs: `EXPLORER_GUIDE.md` và `EXPLORER_API.md`
- Xem DevTools Console (F12)
- Kiểm tra server logs

---

**Happy Exploring! 🎉**

**Version**: 1.0.0  
**Last Updated**: November 15, 2024
