# Integration Guide - Client & Server

## Overview

This guide explains how to integrate the React client application with the Node.js/Express API server.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│           React Client (Port 3001)                      │
│  - User Interface                                       │
│  - Form Management                                      │
│  - State Management (Zustand)                          │
│  - Client-side Routing                                 │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP/CORS
                   │ REST API Calls
                   ▼
┌─────────────────────────────────────────────────────────┐
│      Node.js/Express Server (Port 3000)                │
│  - REST API Endpoints                                   │
│  - Blockchain Integration                              │
│  - Organization Context (x-org header)                │
│  - Fabric Network Communication                        │
└──────────────────┬──────────────────────────────────────┘
                   │ gRPC/Fabric SDK
                   │ Chaincode Calls
                   ▼
┌─────────────────────────────────────────────────────────┐
│    Hyperledger Fabric Network                          │
│  - Blockchain Ledger                                    │
│  - Smart Contracts (Chaincode)                         │
│  - Multiple Organizations                              │
│  - Consensus Mechanism                                 │
└─────────────────────────────────────────────────────────┘
```

## Ports Configuration

### Development Environment

| Component | Port | URL | Purpose |
|-----------|------|-----|---------|
| React Client | 3001 | http://localhost:3001 | UI application |
| API Server | 3000 | http://localhost:3000 | REST endpoints |
| Fabric Network | 7051, 7052, etc | peer/orderer | Blockchain |

### Production Environment

| Component | Configuration |
|-----------|---------------|
| React Client | Served from CDN or static hosting |
| API Server | Docker container or cloud service |
| Fabric Network | Kubernetes or on-premise cluster |

## API Integration Points

### Authentication Flow

```
Client                          Server                      Fabric
  │                              │                          │
  ├─ POST /api/auth/login ──────>│                          │
  │                              ├─ Verify credentials      │
  │<───── JWT Token ─────────────┤                          │
  │                              │                          │
  ├─ All requests with:          │                          │
  │  Authorization: JWT          │                          │
  │  x-org: org1/org2           │                          │
  │                              │                          │
```

### Topic Registration Flow

```
Student                    API Server                    Fabric Network
  │                            │                              │
  ├─ POST /api/topics/register ─>│                           │
  │   (x-org: org1)             │                           │
  │                             ├─ Validate input           │
  │                             ├─ Call fabric SDK ────────>│
  │                             │  registerTopic()          │
  │                             │                      ┌────┤
  │                             │<── Transaction ID ──┘     │
  │<─── Success Response ───────┤                           │
  │                             │                           │
```

### Supervisor Approval Flow

```
Supervisor                API Server                    Fabric Network
  │                            │                              │
  ├─ PUT /api/topics/:id/approve ─>│                        │
  │   (x-org: org2)             │                           │
  │   Body: { supervisorId,     │                           │
  │           supervisorName,   │                           │
  │           comments }        │                           │
  │                             ├─ Authenticate user       │
  │                             ├─ Call fabric SDK ────────>│
  │                             │  approveTopic()           │
  │                             │                      ┌────┤
  │                             │<── Updated record ──┘     │
  │<─── Topic Object ───────────┤                           │
  │                             │                           │
```

## Environment Configuration

### Client Side (.env)

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Application
VITE_APP_TITLE=Quản Lý Đề Tài - Blockchain

# Optional: Analytics
VITE_ANALYTICS_ID=your_analytics_id
```

### Server Side (.env)

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Fabric Configuration
FABRIC_NETWORK=test-network
FABRIC_ORG1=org1
FABRIC_ORG2=org2
FABRIC_CHANNEL=mychannel
FABRIC_CHAINCODE=topic

# Wallet Paths
WALLET_PATH=./wallet
CERTS_PATH=./certs

# CORS
CORS_ORIGIN=http://localhost:3001
```

## Request/Response Format

### Standard Request Format

```json
{
  "headers": {
    "Content-Type": "application/json",
    "x-org": "org1",
    "Authorization": "Bearer {jwt_token}"
  },
  "body": {
    "field1": "value1",
    "field2": "value2"
  }
}
```

### Standard Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "topicId": "TOPIC001",
    "title": "AI Project",
    ...
  }
}
```

### Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details"
}
```

## API Endpoints Reference

### Topic Operations

#### Student Operations (Org1)

| Method | Endpoint | Client Call | Blockchain |
|--------|----------|-------------|-----------|
| POST | `/api/topics/register` | `registerTopic()` | registerTopic |
| PUT | `/api/topics/:id/progress` | `updateProgress()` | updateProgress |
| GET | `/api/topics/:id/approval-status` | `getApprovalStatus()` | getApprovalStatus |
| GET | `/api/topics/:id/change-history` | `getChangeHistory()` | getChangeHistory |

#### Supervisor Operations (Org2)

| Method | Endpoint | Client Call | Blockchain |
|--------|----------|-------------|-----------|
| PUT | `/api/topics/:id/approve` | `approveTopic()` | approveTopic |
| PUT | `/api/topics/:id/reject` | `rejectTopic()` | rejectTopic |
| POST | `/api/topics/:id/evaluation` | `addEvaluation()` | addEvaluation |
| GET | `/api/topics/:id/progress` | `trackProgress()` | trackProgress |

#### Common Operations

| Method | Endpoint | Client Call |
|--------|----------|-------------|
| GET | `/api/topics` | `getTopics()` |
| GET | `/api/topics/:id` | `getTopicById()` |
| GET | `/api/topics/student/:id` | `getTopicsByStudent()` |
| GET | `/api/topics/supervisor/:id` | `getTopicsBySupervisor()` |
| GET | `/api/topics/status/:status` | `getTopicsByStatus()` |
| GET | `/api/topics/field/:field` | `getTopicsByField()` |

## CORS Configuration

### Client Side

The client is configured to proxy API calls through Vite's dev server:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    }
  }
}
```

### Server Side

API server must enable CORS:

```javascript
// app.js
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-org', 'Authorization']
}));
```

## Error Handling

### Client Error Handling

The client automatically handles:

1. **Network Errors**: "Connection refused" → "API server not running"
2. **4xx Errors**: Validation errors → Display form errors
3. **5xx Errors**: Server errors → Display error message with retry
4. **Timeout**: Long requests → Loading state with timeout alert

### Server Error Handling

The server returns appropriate HTTP status codes:

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **401**: Unauthorized
- **403**: Forbidden (organization mismatch)
- **404**: Not Found
- **500**: Internal Server Error

## Authentication & Authorization

### Organization Verification

```
Client Login
  ├─ Store user data (id, name, role, organization)
  ├─ Set x-org header for all requests
  └─ Server validates x-org matches user's organization

Server
  ├─ Verify JWT token
  ├─ Check x-org header
  ├─ Validate user has permission for operation
  └─ Call Fabric with appropriate credentials
```

### Role-Based Access

| Operation | Student (Org1) | Supervisor (Org2) |
|-----------|---|---|
| Register Topic | ✅ | ❌ |
| Update Progress | ✅ | ✅ |
| Approve/Reject | ❌ | ✅ |
| Add Evaluation | ❌ | ✅ |
| View All Topics | ✅ | ✅ |
| View Own Topics | ✅ | ✅ |

## Deployment Integration

### Docker Compose Example

```yaml
version: '3.8'

services:
  client:
    build: ./client
    ports:
      - "3001:3001"
    environment:
      VITE_API_BASE_URL=http://api:3000
    depends_on:
      - api

  api:
    build: ./server
    ports:
      - "3000:3000"
    environment:
      PORT=3000
      CORS_ORIGIN=http://client:3001
    depends_on:
      - fabric-network

  fabric-network:
    # Fabric network configuration
```

### Kubernetes Example

```yaml
apiVersion: v1
kind: Service
metadata:
  name: topic-client
spec:
  selector:
    app: topic-client
  ports:
    - port: 80
      targetPort: 3001
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: topic-client
spec:
  replicas: 2
  selector:
    matchLabels:
      app: topic-client
  template:
    metadata:
      labels:
        app: topic-client
    spec:
      containers:
      - name: client
        image: topic-client:latest
        env:
        - name: VITE_API_BASE_URL
          value: "http://topic-api:3000"
        ports:
        - containerPort: 3001
```

## Monitoring & Logging

### Client Monitoring

```typescript
// Log API calls in browser console
apiClient.interceptors.request.use((config) => {
  console.log('API Request:', config.method, config.url);
  return config;
});

// Track performance
console.time('API Call');
// ... API call
console.timeEnd('API Call');
```

### Server Monitoring

```javascript
// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Org: ${req.headers['x-org']}`);
  next();
});

// Track errors
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  // Send to error tracking service
  trackError(err);
});
```

## Development Workflow

### Full Stack Development

1. **Start Fabric Network**
   ```bash
   cd test-network
   ./network.sh up createChannel -ca
   ```

2. **Start API Server**
   ```bash
   cd server
   npm run dev
   ```

3. **Start Client**
   ```bash
   cd client
   npm run dev
   ```

4. **Test Integration**
   - Open http://localhost:3001
   - Login as student (org1)
   - Register a topic
   - Verify in server logs
   - Check Fabric ledger

## Troubleshooting Integration

### Issue: "Failed to connect to API"

**Solution**:
1. Verify server is running: `curl http://localhost:3000/health`
2. Check CORS configuration in server
3. Verify VITE_API_BASE_URL in client .env

### Issue: "Organization mismatch error"

**Solution**:
1. Check user organization matches x-org header
2. Verify Fabric credentials for organization
3. Check server environment variables

### Issue: "Blockchain transaction failed"

**Solution**:
1. Verify Fabric network is running
2. Check chaincode deployment
3. Review Fabric logs: `docker logs fabric-peer`
4. Verify wallet credentials

## Best Practices

1. **Always set x-org header** from authenticated user
2. **Validate on both client and server** (defense in depth)
3. **Log all API interactions** for debugging
4. **Use environment variables** for configuration
5. **Test both organizations** in development
6. **Keep API and client versions aligned**
7. **Handle network timeouts** gracefully
8. **Implement retry logic** for transient failures

---

**Integration Complete!** The client and server are now ready to work together.
