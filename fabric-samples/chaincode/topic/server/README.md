# Topic API Server

REST API Server cho hệ thống quản lý đề tài trên Hyperledger Fabric.

## Mục tiêu

Cung cấp các API endpoints để:
- **Student Org (Org1)** đăng ký đề tài, cập nhật tiến độ, xem trạng thái phê duyệt, tra cứu lịch sử
- **Supervisor Org (Org2)** duyệt/từ chối đề tài, theo dõi tiến độ, thêm đánh giá
- **Cả 2 orgs** truy vấn dữ liệu đề tài

## Yêu cầu

- Node.js >= 20
- npm
- Hyperledger Fabric network (đã setup)

## Cài đặt

1. **Clone repository hoặc tạo thư mục:**
```bash
cd fabric-samples/chaincode/topic/server
```

2. **Cài đặt dependencies:**
```bash
npm install
```

3. **Setup environment:**
```bash
cp .env.example .env
# Chỉnh sửa .env với các giá trị cấu hình của bạn
```

## Chạy Server

### Development Mode (với auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## Project Structure

```
server/
├── app.js                      # Entry point, Express setup
├── package.json               # Dependencies
├── .env.example              # Environment template
├── API_DOCUMENTATION.md      # API documentation đầy đủ
├── README.md                 # File này
│
├── config/
│   └── config.js            # Configuration management
│
├── fabric/
│   └── fabricClient.js       # Fabric SDK client
│
├── controllers/
│   └── topicController.js    # Business logic & request handlers
│
├── routes/
│   └── topicRoutes.js        # API route definitions
│
└── utils/
    └── validators.js         # Input validation functions
```

## API Overview

### Student Org (Org1)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/topics/register` | Đăng ký đề tài mới |
| PUT | `/api/topics/:topicId/progress` | Cập nhật tiến độ |
| GET | `/api/topics/:topicId/approval-status` | Xem trạng thái phê duyệt |
| GET | `/api/topics/:topicId/change-history` | Tra cứu lịch sử thay đổi |

### Supervisor Org (Org2)
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/topics/:topicId/approve` | Duyệt đề tài |
| PUT | `/api/topics/:topicId/reject` | Từ chối đề tài |
| POST | `/api/topics/:topicId/evaluation` | Thêm đánh giá |
| GET | `/api/topics/:topicId/progress` | Theo dõi tiến độ |

### Common (Both Orgs)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/topics` | Lấy tất cả đề tài |
| GET | `/api/topics/:topicId` | Lấy chi tiết đề tài |
| GET | `/api/topics/student/:studentId` | Lấy đề tài của sinh viên |
| GET | `/api/topics/supervisor/:supervisorId` | Lấy đề tài của giáo viên |
| GET | `/api/topics/status/:status` | Lấy đề tài theo trạng thái |
| GET | `/api/topics/field/:field` | Lấy đề tài theo lĩnh vực |

## Ví dụ Sử dụng

### 1. Sinh viên đăng ký đề tài

```bash
curl -X POST http://localhost:3000/api/topics/register \
  -H "Content-Type: application/json" \
  -d '{
    "topicId": "TOPIC001",
    "title": "AI-powered Student Management System",
    "description": "Hệ thống quản lý sinh viên dùng AI",
    "studentId": "SV001",
    "studentName": "Nguyễn Văn A",
    "field": "AI"
  }'
```

### 2. Giáo viên duyệt đề tài

```bash
curl -X PUT http://localhost:3000/api/topics/TOPIC001/approve \
  -H "Content-Type: application/json" \
  -d '{
    "supervisorId": "GV001",
    "supervisorName": "Trần Thị B",
    "comments": "Đề tài rất tốt, tôi sẽ hướng dẫn"
  }'
```

### 3. Sinh viên cập nhật tiến độ

```bash
curl -X PUT http://localhost:3000/api/topics/TOPIC001/progress \
  -H "Content-Type: application/json" \
  -d '{
    "stage": "DEVELOPMENT",
    "percentage": 50,
    "details": "Hoàn thành backend API, đang phát triển frontend"
  }'
```

### 4. Giáo viên thêm đánh giá

```bash
curl -X POST http://localhost:3000/api/topics/TOPIC001/evaluation \
  -H "Content-Type: application/json" \
  -d '{
    "supervisorId": "GV001",
    "supervisorName": "Trần Thị B",
    "evaluation": "Tiến độ tốt, code quality cao, tiếp tục phát triển",
    "rating": 8.5
  }'
```

### 5. Lấy danh sách tất cả đề tài

```bash
curl http://localhost:3000/api/topics
```

### 6. Lấy danh sách đề tài của sinh viên

```bash
curl http://localhost:3000/api/topics/student/SV001
```

## Topic Status Workflow

```
PENDING (Đang chờ duyệt)
   ↓
   ├─→ APPROVED (Được duyệt) → có thể cập nhật tiến độ
   │
   └─→ REJECTED (Bị từ chối)
```

## Progress Stages

Các giai đoạn của tiến độ:
- `INITIAL` - Ban đầu
- `ANALYSIS` - Phân tích yêu cầu
- `DEVELOPMENT` - Phát triển
- `TESTING` - Kiểm thử
- `COMPLETED` - Hoàn thành

## Lỗi Thường Gặp

### 1. Topic already exists
```json
{
  "error": "Topic with ID TOPIC001 already exists"
}
```
**Giải pháp:** Sử dụng topicId khác

### 2. Topic must be approved before updating progress
```json
{
  "error": "Topic must be approved before updating progress"
}
```
**Giải pháp:** Đợi giáo viên phê duyệt trước

### 3. Only Student Org can register topics
```json
{
  "error": "Only Student Org (Org1) can register topics"
}
```
**Giải pháp:** Kiểm tra MSP ID của user

## Configuration

Chỉnh sửa file `.env`:

```env
PORT=3000                          # Port chạy server
NODE_ENV=development              # Environment
CHANNEL_NAME=mychannel            # Fabric channel
CHAINCODE_ID=topiccc              # Chaincode name
ORG1_MSPID=Org1MSP               # Org1 MSP ID
ORG2_MSPID=Org2MSP               # Org2 MSP ID
```

## Monitoring

Server logs sẽ hiển thị:
- Các request được nhận
- Transactions được submit
- Errors và exceptions

## Development

### Chạy với auto-reload
```bash
npm run dev
```

### Debug mode
```bash
DEBUG=* npm run dev
```

## Production Deployment

1. **Build:**
```bash
npm install --production
```

2. **Run:**
```bash
NODE_ENV=production npm start
```

3. **Using PM2:**
```bash
npm install -g pm2
pm2 start app.js --name "topic-api"
pm2 save
pm2 startup
```

## Security Notes

- ⚠️ Kiểm tra MSP ID của requester
- ⚠️ Validate tất cả inputs
- ⚠️ Sử dụng HTTPS trong production
- ⚠️ Implement authentication/authorization

## Support & Documentation

Xem file `API_DOCUMENTATION.md` để biết chi tiết về:
- Tất cả API endpoints
- Request/Response format
- Error handling
- Example requests

## License

Apache-2.0
