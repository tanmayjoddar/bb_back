# 🧪 Brain Battle 3.0 Backend - Postman Testing Guide

**Base URL:** `http://localhost:4000/api`
**Production URL:** `[Your Production Domain]/api`

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Registration Endpoints](#registration-endpoints)
3. [Admin Endpoints](#admin-endpoints)
4. [Error Handling](#error-handling)
5. [Postman Collection Import](#postman-collection-import)

---

## 🔐 Authentication

### Admin Authentication Flow

1. **Login first** to get JWT token
2. **Copy the token** from response
3. **Use token in Authorization header** for protected routes

**Header Format:**

```
Authorization: Bearer <token_from_login_response>
```

---

## 📡 Registration Endpoints

### 1. Register Participant

**POST** `/register`

#### Request

```
Method: POST
URL: http://localhost:4000/api/register
Headers:
  Content-Type: application/json

Body (JSON):
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "9876543210",
  "college": "XYZ Engineering College"
}
```

#### Response - Success (201)

```json
{
  "success": true,
  "participant": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "9876543210",
    "college": "XYZ Engineering College",
    "code": "a1b2c3d4",
    "createdAt": "2025-10-19T12:30:45.123Z"
  },
  "qrDataUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw..."
}
```

#### Response - Error (400 - Missing Fields)

```json
{
  "message": "Name and email are required",
  "stack": "Error: Name and email are required\n    at registerParticipant..."
}
```

#### Response - Error (400 - Duplicate Email)

```json
{
  "message": "Email already registered",
  "stack": "Error: Email already registered\n    at registerParticipant..."
}
```

---

### 2. Get Participant by Code

**GET** `/register/:code`

#### Request

```
Method: GET
URL: http://localhost:4000/api/register/a1b2c3d4
Headers:
  Content-Type: application/json
```

#### Response - Success (200)

```json
{
  "success": true,
  "participant": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "9876543210",
    "college": "XYZ Engineering College",
    "code": "a1b2c3d4",
    "createdAt": "2025-10-19T12:30:45.123Z"
  }
}
```

#### Response - Error (404)

```json
{
  "message": "Participant not found",
  "stack": "Error: Participant not found\n    at getParticipantByCode..."
}
```

---

### 3. Scan QR Code

**POST** `/register/scan`

#### Request Option A - With Code

```
Method: POST
URL: http://localhost:4000/api/register/scan
Headers:
  Content-Type: application/json

Body (JSON):
{
  "code": "a1b2c3d4"
}
```

#### Request Option B - With Full Payload

```
Method: POST
URL: http://localhost:4000/api/register/scan
Headers:
  Content-Type: application/json

Body (JSON):
{
  "payload": "{\"id\":\"550e8400-e29b-41d4-a716-446655440000\",\"code\":\"a1b2c3d4\",\"name\":\"John Doe\"}"
}
```

#### Response - Success (200)

```json
{
  "success": true,
  "participant": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "9876543210",
    "college": "XYZ Engineering College",
    "code": "a1b2c3d4",
    "createdAt": "2025-10-19T12:30:45.123Z"
  }
}
```

#### Response - Error (400 - Missing Both Fields)

```json
{
  "message": "Either code or payload is required",
  "stack": "Error: Either code or payload is required\n    at scanQR..."
}
```

#### Response - Error (400 - Invalid Payload)

```json
{
  "message": "Invalid payload format",
  "stack": "Error: Invalid payload format\n    at scanQR..."
}
```

#### Response - Error (404)

```json
{
  "message": "Participant not found",
  "stack": "Error: Participant not found\n    at scanQR..."
}
```

---

### 4. Get QR Code Image

**GET** `/register/qr/:code`

#### Request

```
Method: GET
URL: http://localhost:4000/api/register/qr/a1b2c3d4
Headers: (None required)
```

#### Response - Success (200)

- Returns PNG image file
- Content-Type: `image/png`
- Binary data (QR code image)

#### Response - Error (404)

```json
{
  "message": "Participant not found",
  "stack": "Error: Participant not found\n    at serveQRCode..."
}
```

---

## 👨‍💼 Admin Endpoints

### 1. Admin Login

**POST** `/admin/login`

#### Request

```
Method: POST
URL: http://localhost:4000/api/admin/login
Headers:
  Content-Type: application/json

Body (JSON):
{
  "password": "brainbattle2025"
}
```

#### Response - Success (200)

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjA4NzY4NjEsImV4cCI6MTc2MDk2MzI2MX0.ehPn4-JcD335ym6aNcHZkpVDLkpnnqmgk5lpHi8hIwQ"
}
```

#### Response - Error (401)

```json
{
  "message": "Invalid credentials",
  "stack": "Error: Invalid credentials\n    at adminLogin..."
}
```

---

### 2. Get All Participants (Protected)

**GET** `/admin/participants`

#### Request

```
Method: GET
URL: http://localhost:4000/api/admin/participants
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjA4NzY4NjEsImV4cCI6MTc2MDk2MzI2MX0.ehPn4-JcD335ym6aNcHZkpVDLkpnnqmgk5lpHi8hIwQ
  Content-Type: application/json
```

#### Response - Success (200)

```json
{
  "success": true,
  "participants": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "9876543210",
      "college": "XYZ Engineering College",
      "code": "a1b2c3d4",
      "createdAt": "2025-10-19T12:30:45.123Z"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "phone": "9876543211",
      "college": "ABC University",
      "code": "e5f6g7h8",
      "createdAt": "2025-10-19T12:35:20.456Z"
    }
  ]
}
```

#### Response - Error (401 - Missing Token)

```json
{
  "message": "Authentication required",
  "stack": "Error: Authentication required\n    at authenticateAdmin..."
}
```

#### Response - Error (401 - Invalid Token)

```json
{
  "message": "Invalid token",
  "stack": "Error: Invalid token\n    at authenticateAdmin..."
}
```

---

### 3. Create Round (Protected)

**POST** `/admin/rounds`

#### Request

```
Method: POST
URL: http://localhost:4000/api/admin/rounds
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjA4NzY4NjEsImV4cCI6MTc2MDk2MzI2MX0.ehPn4-JcD335ym6aNcHZkpVDLkpnnqmgk5lpHi8hIwQ
  Content-Type: application/json

Body (JSON):
{
  "name": "Semifinals"
}
```

#### Response - Success (201)

```json
{
  "success": true,
  "round": {
    "id": "3be5b050-3621-4acc-9190-2de52cde7ddc",
    "name": "Semifinals",
    "status": "pending",
    "createdAt": "2025-10-19T12:40:30.789Z"
  }
}
```

#### Response - Error (400 - Missing Name)

```json
{
  "message": "Round name is required",
  "stack": "Error: Round name is required\n    at createRound..."
}
```

#### Response - Error (401 - No Auth)

```json
{
  "message": "Authentication required",
  "stack": "Error: Authentication required\n    at authenticateAdmin..."
}
```

---

### 4. Assign Participant to Round (Protected)

**POST** `/admin/rounds/:roundId/assign`

#### Request

```
Method: POST
URL: http://localhost:4000/api/admin/rounds/3be5b050-3621-4acc-9190-2de52cde7ddc/assign
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjA4NzY4NjEsImV4cCI6MTc2MDk2MzI2MX0.ehPn4-JcD335ym6aNcHZkpVDLkpnnqmgk5lpHi8hIwQ
  Content-Type: application/json

Body (JSON):
{
  "participantId": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### Response - Success (201)

```json
{
  "success": true,
  "participantRound": {
    "id": "7ce5d050-1521-4acc-9190-2de52cde8eff",
    "participantId": "550e8400-e29b-41d4-a716-446655440000",
    "roundId": "3be5b050-3621-4acc-9190-2de52cde7ddc",
    "status": "registered",
    "createdAt": "2025-10-19T12:45:15.012Z"
  }
}
```

#### Response - Error (400 - Missing Participant ID)

```json
{
  "message": "Participant ID is required",
  "stack": "Error: Participant ID is required\n    at assignParticipantToRound..."
}
```

#### Response - Error (404 - Participant Not Found)

```json
{
  "message": "Participant not found",
  "stack": "Error: Participant not found\n    at assignParticipantToRound..."
}
```

#### Response - Error (404 - Round Not Found)

```json
{
  "message": "Round not found",
  "stack": "Error: Round not found\n    at assignParticipantToRound..."
}
```

#### Response - Error (401 - No Auth)

```json
{
  "message": "Authentication required",
  "stack": "Error: Authentication required\n    at authenticateAdmin..."
}
```

---

## 🚨 Error Handling

### Common HTTP Status Codes

| Code | Meaning                            | Example                       |
| ---- | ---------------------------------- | ----------------------------- |
| 200  | OK - Request successful            | GET /register/:code           |
| 201  | Created - Resource created         | POST /register, /admin/rounds |
| 400  | Bad Request - Invalid input        | Missing required fields       |
| 401  | Unauthorized - Auth required       | Missing or invalid token      |
| 404  | Not Found - Resource doesn't exist | Invalid code or ID            |
| 500  | Server Error - Internal issue      | Database connection error     |

### Error Response Format

```json
{
  "message": "Error description",
  "stack": "Full error stack trace (only in development)"
}
```

---

## 📦 Postman Collection Import

### Option 1: Import JSON Collection

Create a file named `BrainBattle-API.postman_collection.json`:

```json
{
  "info": {
    "name": "Brain Battle 3.0 Backend",
    "description": "API endpoints for Brain Battle tournament registration system",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Registration",
      "item": [
        {
          "name": "Register Participant",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": {
              "raw": "http://localhost:4000/api/register",
              "protocol": "http",
              "host": ["localhost"],
              "port": "4000",
              "path": ["api", "register"]
            },
            "body": {
              "mode": "raw",
              "raw": "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"phone\":\"9876543210\",\"college\":\"XYZ College\"}"
            }
          }
        },
        {
          "name": "Get Participant by Code",
          "request": {
            "method": "GET",
            "url": {
              "raw": "http://localhost:4000/api/register/a1b2c3d4",
              "protocol": "http",
              "host": ["localhost"],
              "port": "4000",
              "path": ["api", "register", "a1b2c3d4"]
            }
          }
        },
        {
          "name": "Scan QR Code",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": {
              "raw": "http://localhost:4000/api/register/scan",
              "protocol": "http",
              "host": ["localhost"],
              "port": "4000",
              "path": ["api", "register", "scan"]
            },
            "body": { "mode": "raw", "raw": "{\"code\":\"a1b2c3d4\"}" }
          }
        },
        {
          "name": "Get QR Code Image",
          "request": {
            "method": "GET",
            "url": {
              "raw": "http://localhost:4000/api/register/qr/a1b2c3d4",
              "protocol": "http",
              "host": ["localhost"],
              "port": "4000",
              "path": ["api", "register", "qr", "a1b2c3d4"]
            }
          }
        }
      ]
    },
    {
      "name": "Admin",
      "item": [
        {
          "name": "Admin Login",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": {
              "raw": "http://localhost:4000/api/admin/login",
              "protocol": "http",
              "host": ["localhost"],
              "port": "4000",
              "path": ["api", "admin", "login"]
            },
            "body": {
              "mode": "raw",
              "raw": "{\"password\":\"brainbattle2025\"}"
            }
          }
        },
        {
          "name": "Get All Participants",
          "request": {
            "method": "GET",
            "header": [
              { "key": "Authorization", "value": "Bearer YOUR_TOKEN_HERE" }
            ],
            "url": {
              "raw": "http://localhost:4000/api/admin/participants",
              "protocol": "http",
              "host": ["localhost"],
              "port": "4000",
              "path": ["api", "admin", "participants"]
            }
          }
        },
        {
          "name": "Create Round",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer YOUR_TOKEN_HERE" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": {
              "raw": "http://localhost:4000/api/admin/rounds",
              "protocol": "http",
              "host": ["localhost"],
              "port": "4000",
              "path": ["api", "admin", "rounds"]
            },
            "body": { "mode": "raw", "raw": "{\"name\":\"Semifinals\"}" }
          }
        },
        {
          "name": "Assign Participant to Round",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer YOUR_TOKEN_HERE" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": {
              "raw": "http://localhost:4000/api/admin/rounds/ROUND_ID/assign",
              "protocol": "http",
              "host": ["localhost"],
              "port": "4000",
              "path": ["api", "admin", "rounds", "ROUND_ID", "assign"]
            },
            "body": {
              "mode": "raw",
              "raw": "{\"participantId\":\"PARTICIPANT_ID\"}"
            }
          }
        }
      ]
    }
  ]
}
```

### Option 2: Manual Setup in Postman

1. **Create new collection:** "Brain Battle 3.0 Backend"
2. **Add folders:** Registration, Admin
3. **Create requests** following the examples above
4. **Set variables** for reusable tokens and IDs

### Option 3: Environment Variables

Create Postman Environment `BrainBattle-Dev`:

```json
{
  "name": "BrainBattle-Dev",
  "values": [
    {
      "key": "base_url",
      "value": "http://localhost:4000/api",
      "enabled": true
    },
    { "key": "admin_token", "value": "", "enabled": true },
    { "key": "participant_code", "value": "", "enabled": true },
    { "key": "round_id", "value": "", "enabled": true },
    { "key": "participant_id", "value": "", "enabled": true }
  ]
}
```

**Usage in requests:**

```
URL: {{base_url}}/register
Header: Authorization: Bearer {{admin_token}}
```

---

## 🔄 Testing Workflow

### 1. **Public Registration Flow**

```
POST /register
  ↓
GET /register/:code (save code)
  ↓
POST /register/scan
  ↓
GET /register/qr/:code (get image)
```

### 2. **Admin Management Flow**

```
POST /admin/login (save token)
  ↓
GET /admin/participants (use token)
  ↓
POST /admin/rounds (use token, save round ID)
  ↓
POST /admin/rounds/:roundId/assign (use token with IDs)
```

---

## 📝 Quick Copy-Paste Templates

### Register Participant

```bash
curl -X POST http://localhost:4000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"9876543210","college":"XYZ"}'
```

### Admin Login

```bash
curl -X POST http://localhost:4000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"brainbattle2025"}'
```

### Get Participants (requires token)

```bash
curl -X GET http://localhost:4000/api/admin/participants \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Scan QR Code

```bash
curl -X POST http://localhost:4000/api/register/scan \
  -H "Content-Type: application/json" \
  -d '{"code":"a1b2c3d4"}'
```

---

## ✅ Validation Checklist

- [ ] All endpoints return correct status codes
- [ ] Registration generates unique codes
- [ ] QR codes are generated and retrievable
- [ ] Admin authentication works
- [ ] Protected routes reject unauthorized access
- [ ] Error messages are clear and helpful
- [ ] Database persists all data correctly
- [ ] Duplicate email prevention works
- [ ] Token expiration is 24 hours
- [ ] QR image endpoint serves PNG files

---

**Last Updated:** October 19, 2025
**API Version:** 1.0.0
**Backend Status:** ✅ Production Ready
