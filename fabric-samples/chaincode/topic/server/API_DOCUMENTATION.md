# Topic API Server Documentation

## Overview
REST API Server để quản lý hệ thống đề tài với Hyperledger Fabric blockchain. Server cung cấp các endpoints cho 2 organizations: Student Org (Org1) và Supervisor Org (Org2).

## Installation

```bash
cd server
npm install
```

## Configuration

1. Sao chép `.env.example` thành `.env`:
```bash
cp .env.example .env
```

2. Chỉnh sửa các giá trị trong `.env` nếu cần

## Running the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server sẽ chạy trên `http://localhost:3000` (hoặc port được cấu hình)

## API Endpoints

### Health Check
- **GET** `/health` - Kiểm tra server status

---

## STUDENT ORG (ORG1) - Endpoints

### 1. Đăng ký đề tài mới
- **POST** `/api/topics/register`
- **Request Body:**
```json
{
  "topicId": "TOPIC001",
  "title": "AI-powered Student Management System",
  "description": "A comprehensive system using machine learning...",
  "studentId": "SV001",
  "studentName": "Nguyễn Văn A",
  "field": "AI"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Topic registered successfully",
  "data": { /* topic object */ }
}
```

### 2. Cập nhật tiến độ thực hiện
- **PUT** `/api/topics/:topicId/progress`
- **Request Body:**
```json
{
  "stage": "DEVELOPMENT",
  "percentage": 50,
  "details": "Hoàn thành backend API, đang phát triển frontend"
}
```
- **Valid Stages:** INITIAL, ANALYSIS, DEVELOPMENT, TESTING, COMPLETED
- **Response:**
```json
{
  "success": true,
  "message": "Progress updated successfully",
  "data": { /* updated topic object */ }
}
```

### 3. Xem trạng thái phê duyệt
- **GET** `/api/topics/:topicId/approval-status`
- **Response:**
```json
{
  "success": true,
  "data": {
    "topicId": "TOPIC001",
    "title": "AI-powered Student Management System",
    "status": "APPROVED",
    "approvedBy": "Trần Thị B",
    "comments": "Good topic, approved!",
    "createdAt": "2025-11-15T10:00:00.000Z",
    "updatedAt": "2025-11-15T11:00:00.000Z"
  }
}
```

### 4. Tra cứu lịch sử thay đổi
- **GET** `/api/topics/:topicId/change-history`
- **Response:**
```json
{
  "success": true,
  "data": {
    "topicId": "TOPIC001",
    "title": "AI-powered Student Management System",
    "history": [
      {
        "timestamp": "2025-11-15T10:00:00.000Z",
        "action": "REGISTERED",
        "status": "PENDING",
        "actor": "Nguyễn Văn A",
        "details": "Topic registered by student"
      },
      {
        "timestamp": "2025-11-15T11:00:00.000Z",
        "action": "APPROVED",
        "status": "APPROVED",
        "actor": "Trần Thị B",
        "details": "Approved by supervisor: Good topic, approved!"
      }
    ]
  }
}
```

---

## SUPERVISOR ORG (ORG2) - Endpoints

### 1. Duyệt đề tài
- **PUT** `/api/topics/:topicId/approve`
- **Request Body:**
```json
{
  "supervisorId": "SV_ADMIN001",
  "supervisorName": "Trần Thị B",
  "comments": "Good topic, I will supervise this work"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Topic approved successfully",
  "data": { /* updated topic object */ }
}
```

### 2. Từ chối đề tài
- **PUT** `/api/topics/:topicId/reject`
- **Request Body:**
```json
{
  "supervisorId": "SV_ADMIN001",
  "supervisorName": "Trần Thị B",
  "reason": "Topic scope is too large, need to reduce"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Topic rejected successfully",
  "data": { /* updated topic object */ }
}
```

### 3. Thêm nhận xét, đánh giá
- **POST** `/api/topics/:topicId/evaluation`
- **Request Body:**
```json
{
  "supervisorId": "SV_ADMIN001",
  "supervisorName": "Trần Thị B",
  "evaluation": "Excellent progress on the backend development. Keep up the good work!",
  "rating": 8.5
}
```
- **Rating:** 0-10
- **Response:**
```json
{
  "success": true,
  "message": "Evaluation added successfully",
  "data": { /* updated topic object */ }
}
```

### 4. Theo dõi tiến độ
- **GET** `/api/topics/:topicId/progress`
- **Response:**
```json
{
  "success": true,
  "data": {
    "topicId": "TOPIC001",
    "title": "AI-powered Student Management System",
    "studentName": "Nguyễn Văn A",
    "supervisorName": "Trần Thị B",
    "progress": {
      "stage": "DEVELOPMENT",
      "percentage": 50,
      "lastUpdate": "2025-11-15T12:30:00.000Z",
      "updates": [
        {
          "timestamp": "2025-11-15T12:30:00.000Z",
          "stage": "DEVELOPMENT",
          "percentage": 50,
          "details": "Hoàn thành backend API, đang phát triển frontend"
        }
      ]
    },
    "status": "APPROVED",
    "updatedAt": "2025-11-15T12:30:00.000Z"
  }
}
```

---

## COMMON ENDPOINTS (Both Orgs)

### 1. Lấy danh sách tất cả đề tài
- **GET** `/api/topics`
- **Response:**
```json
{
  "success": true,
  "data": [
    { /* topic object 1 */ },
    { /* topic object 2 */ }
  ]
}
```

### 2. Lấy thông tin chi tiết đề tài
- **GET** `/api/topics/:topicId`
- **Response:**
```json
{
  "success": true,
  "data": { /* full topic object */ }
}
```

### 3. Lấy danh sách đề tài của sinh viên
- **GET** `/api/topics/student/:studentId`
- **Response:**
```json
{
  "success": true,
  "data": [ /* array of topics */ ]
}
```

### 4. Lấy danh sách đề tài của giáo viên
- **GET** `/api/topics/supervisor/:supervisorId`
- **Response:**
```json
{
  "success": true,
  "data": [ /* array of topics */ ]
}
```

### 5. Lấy danh sách đề tài theo trạng thái
- **GET** `/api/topics/status/:status`
- **Valid Status:** PENDING, APPROVED, REJECTED
- **Response:**
```json
{
  "success": true,
  "data": [ /* array of topics */ ]
}
```

### 6. Lấy danh sách đề tài theo lĩnh vực
- **GET** `/api/topics/field/:field`
- **Example Fields:** AI, Web, Mobile, Database, etc.
- **Response:**
```json
{
  "success": true,
  "data": [ /* array of topics */ ]
}
```

---

## Error Handling

Tất cả các API responses sẽ tuân theo format sau:

### Success Response (2xx)
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response (4xx, 5xx)
```json
{
  "error": "Error message",
  "details": "Detailed error description"
}
```

---

## Common HTTP Status Codes

- **200 OK** - Request successful (GET, PUT)
- **201 Created** - Resource created (POST)
- **400 Bad Request** - Invalid input
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

---

## Example Usage with cURL

### Register a new topic
```bash
curl -X POST http://localhost:3000/api/topics/register \
  -H "Content-Type: application/json" \
  -d '{
    "topicId": "TOPIC001",
    "title": "AI System",
    "description": "An AI-powered system",
    "studentId": "SV001",
    "studentName": "Nguyen Van A",
    "field": "AI"
  }'
```

### Get all topics
```bash
curl http://localhost:3000/api/topics
```

### Approve a topic
```bash
curl -X PUT http://localhost:3000/api/topics/TOPIC001/approve \
  -H "Content-Type: application/json" \
  -d '{
    "supervisorId": "SV_ADMIN001",
    "supervisorName": "Tran Thi B",
    "comments": "Approved!"
  }'
```

### Get topic by ID
```bash
curl http://localhost:3000/api/topics/TOPIC001
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| HOST | Server host | localhost |
| NODE_ENV | Environment | development |
| CHANNEL_NAME | Fabric channel | mychannel |
| CHAINCODE_ID | Chaincode name | topiccc |
| ORG1_MSPID | Org1 MSP ID | Org1MSP |
| ORG2_MSPID | Org2 MSP ID | Org2MSP |

---

## Architecture

```
server/
├── app.js                 # Express application setup
├── package.json          # Dependencies
├── .env.example          # Environment template
├── config/
│   └── config.js         # Configuration management
├── fabric/
│   └── fabricClient.js   # Fabric network client
├── controllers/
│   └── topicController.js # API request handlers
├── routes/
│   └── topicRoutes.js    # API route definitions
└── utils/
    └── validators.js     # Input validation
```

---

## Notes

- Tất cả timestamps được lưu trữ ở định dạng ISO 8601
- Org1 chỉ có thể đăng ký đề tài và cập nhật tiến độ
- Org2 chỉ có thể duyệt/từ chối đề tài và thêm đánh giá
- Quá trình duyệt chỉ áp dụng cho đề tài có trạng thái PENDING
- Cập nhật tiến độ chỉ có thể thực hiện nếu đề tài đã được APPROVED
