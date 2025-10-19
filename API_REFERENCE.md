# 📚 Brain Battle 3.0 - Complete API Reference & Tech Stack

## 🎯 Project Overview

**Brain Battle 3.0** is a **Tournament Registration & QR-Based Participant Scanning System** designed for college events. It provides participant registration with automatic QR code generation, real-time QR scanning at event gates, and admin dashboard for tournament management.

---

## 🏗️ Architecture & Tech Stack

### Backend Architecture

```
┌─────────────────┐
│   Frontend      │ (React/Vue/Next.js)
└────────┬────────┘
         │ HTTP/REST
         ↓
┌─────────────────────────────────────┐
│    Express.js Server (TypeScript)   │
├─────────────────────────────────────┤
│ ✓ Routing Layer (Registration/Admin)│
│ ✓ Authentication (JWT)              │
│ ✓ Error Handling                    │
│ ✓ QR Code Generation                │
└────────┬────────────────────────────┘
         │ SQL Queries
         ↓
┌─────────────────────────────────────┐
│    Prisma ORM                       │
├─────────────────────────────────────┤
│ ✓ Type-safe Database Access         │
│ ✓ Migrations                        │
│ ✓ Schema Management                 │
└────────┬────────────────────────────┘
         │ PostgreSQL Driver
         ↓
┌─────────────────────────────────────┐
│    PostgreSQL Database              │
├─────────────────────────────────────┤
│ ✓ Participants Table                │
│ ✓ Rounds Table                      │
│ ✓ ParticipantRound Junction Table   │
└─────────────────────────────────────┘
```

### Technology Stack

| Layer          | Technology           | Purpose                | Version |
| -------------- | -------------------- | ---------------------- | ------- |
| **Language**   | TypeScript           | Type-safe JavaScript   | 5.9.3   |
| **Runtime**    | Node.js              | JavaScript runtime     | 18+     |
| **Framework**  | Express.js           | HTTP server framework  | 4.18.2  |
| **ORM**        | Prisma               | Database abstraction   | 5.0.0   |
| **Database**   | PostgreSQL           | Relational database    | Latest  |
| **Auth**       | JWT                  | Token-based auth       | 9.0.2   |
| **QR Code**    | qrcode               | QR generation library  | 1.5.3   |
| **Utils**      | nanoid               | Unique ID generator    | 5.1.6   |
| **Dev Tools**  | Nodemon              | Auto-reload on changes | 3.0.1   |
| **HTTP Utils** | CORS, Helmet, Morgan | Security & logging     | Latest  |

### Key Dependencies

```json
{
  "production": {
    "@prisma/client": "^5.0.0",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "qrcode": "^1.5.3",
    "nanoid": "^5.1.6",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.1"
  },
  "dev": {
    "typescript": "^5.9.3",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.1",
    "prisma": "^5.0.0"
  }
}
```

---

## 📊 Database Schema

### ERD (Entity Relationship Diagram)

```
┌──────────────────────────┐
│      Participant         │
├──────────────────────────┤
│ id (UUID) PK             │
│ name (String)            │
│ email (String) UNIQUE    │
│ phone (String)?          │
│ college (String)?        │
│ code (String) UNIQUE     │ ← 8-char unique code
│ qrCode (String)          │ ← QR file path
│ createdAt (DateTime)     │
└────────────┬─────────────┘
             │ 1:M
             ↓
┌──────────────────────────┐
│   ParticipantRound       │
├──────────────────────────┤
│ id (UUID) PK             │
│ participantId (UUID) FK  │
│ roundId (UUID) FK        │
│ status (String)          │
│ createdAt (DateTime)     │
│ UNIQUE: (participantId,  │
│          roundId)        │
└──────────────────────────┘
             ↑
             │ M:1
             │
┌──────────────────────────┐
│        Round             │
├──────────────────────────┤
│ id (UUID) PK             │
│ name (String)            │
│ status (String)          │
│ createdAt (DateTime)     │
└──────────────────────────┘
```

### Prisma Schema

```prisma
model Participant {
  id        String      @id @default(uuid())
  name      String
  email     String      @unique
  phone     String?
  college   String?
  code      String      @unique      // 8-char nanoid
  qrCode    String                   // File path
  createdAt DateTime    @default(now())
  rounds    ParticipantRound[]
}

model Round {
  id           String      @id @default(uuid())
  name         String
  status       String      @default("pending")
  createdAt    DateTime    @default(now())
  participants ParticipantRound[]
}

model ParticipantRound {
  id            String   @id @default(uuid())
  participantId String
  roundId       String
  status        String   @default("registered")
  createdAt     DateTime @default(now())

  participant Participant @relation(fields: [participantId], references: [id])
  round       Round       @relation(fields: [roundId], references: [id])

  @@unique([participantId, roundId])
}
```

---

## 🔄 Complete API Endpoints Reference

### Base URL

```
Development:  http://localhost:4000/api
Production:   https://[your-domain]/api
```

---

## 📝 Endpoints by Category

### 🔷 Registration Endpoints (Public)

#### 1. Register New Participant

```
POST /register
```

**Purpose:** Register a new participant for the tournament

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "college": "XYZ Engineering"
}
```

**Query Parameters:** None

**Headers:**

```
Content-Type: application/json
```

**Response (201 Created):**

```json
{
  "success": true,
  "participant": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "college": "XYZ Engineering",
    "code": "a1b2c3d4",
    "createdAt": "2025-10-19T12:30:45.123Z"
  },
  "qrDataUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw..."
}
```

**Status Codes:**

- `201` - Participant registered successfully
- `400` - Missing required fields or duplicate email
- `500` - Server error

**Validation:**

- `name` - Required, string
- `email` - Required, valid email, unique
- `phone` - Optional, string
- `college` - Optional, string

---

#### 2. Get Participant by Code

```
GET /register/:code
```

**Purpose:** Retrieve participant details using their unique code

**Parameters:**

```
:code - 8-character unique participant code (required)
```

**Headers:**

```
Content-Type: application/json
```

**Response (200 OK):**

```json
{
  "success": true,
  "participant": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "college": "XYZ Engineering",
    "code": "a1b2c3d4",
    "createdAt": "2025-10-19T12:30:45.123Z"
  }
}
```

**Status Codes:**

- `200` - Success
- `404` - Participant not found
- `500` - Server error

---

#### 3. Scan QR Code

```
POST /register/scan
```

**Purpose:** Scan a QR code and retrieve participant data

**Request Option A (with code):**

```json
{
  "code": "a1b2c3d4"
}
```

**Request Option B (with payload):**

```json
{
  "payload": "{\"id\":\"550e8400-e29b-41d4-a716-446655440000\",\"code\":\"a1b2c3d4\",\"name\":\"John Doe\"}"
}
```

**Headers:**

```
Content-Type: application/json
```

**Response (200 OK):**

```json
{
  "success": true,
  "participant": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "college": "XYZ Engineering",
    "code": "a1b2c3d4",
    "createdAt": "2025-10-19T12:30:45.123Z"
  }
}
```

**Status Codes:**

- `200` - Success
- `400` - Invalid format or missing fields
- `404` - Participant not found
- `500` - Server error

---

#### 4. Get QR Code Image

```
GET /register/qr/:code
```

**Purpose:** Download the QR code image for a participant

**Parameters:**

```
:code - 8-character unique participant code (required)
```

**Response (200 OK):**

- Content-Type: `image/png`
- Binary PNG image data
- QR code containing: `{id, code, name}`

**Status Codes:**

- `200` - Image returned
- `404` - Participant not found
- `500` - Server error

---

### 🔷 Admin Endpoints (Protected)

#### 1. Admin Login

```
POST /admin/login
```

**Purpose:** Authenticate admin and receive JWT token

**Request:**

```json
{
  "password": "brainbattle2025"
}
```

**Headers:**

```
Content-Type: application/json
```

**Response (200 OK):**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjA4NzY4NjEsImV4cCI6MTc2MDk2MzI2MX0.ehPn4-JcD335ym6aNcHZkpVDLkpnnqmgk5lpHi8hIwQ"
}
```

**Token Details:**

- Expires in: `24 hours`
- Format: JWT (JSON Web Token)
- Use in subsequent requests: `Authorization: Bearer {token}`

**Status Codes:**

- `200` - Login successful
- `401` - Invalid password
- `500` - Server error

---

#### 2. Get All Participants ⚠️ Protected

```
GET /admin/participants
```

**Purpose:** List all registered participants

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Query Parameters:** None

**Response (200 OK):**

```json
{
  "success": true,
  "participants": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "college": "XYZ Engineering",
      "code": "a1b2c3d4",
      "createdAt": "2025-10-19T12:30:45.123Z"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "9876543211",
      "college": "ABC University",
      "code": "e5f6g7h8",
      "createdAt": "2025-10-19T12:35:20.456Z"
    }
  ]
}
```

**Status Codes:**

- `200` - Success
- `401` - Unauthorized (missing/invalid token)
- `500` - Server error

---

#### 3. Create Tournament Round ⚠️ Protected

```
POST /admin/rounds
```

**Purpose:** Create a new tournament round

**Request:**

```json
{
  "name": "Semifinals"
}
```

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Response (201 Created):**

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

**Validation:**

- `name` - Required, string

**Status Codes:**

- `201` - Round created
- `400` - Missing round name
- `401` - Unauthorized
- `500` - Server error

---

#### 4. Assign Participant to Round ⚠️ Protected

```
POST /admin/rounds/:roundId/assign
```

**Purpose:** Assign a participant to a tournament round

**Parameters:**

```
:roundId - UUID of the round (required)
```

**Request:**

```json
{
  "participantId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Response (201 Created):**

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

**Validation:**

- `participantId` - Required, valid UUID, must exist
- `roundId` - Required in URL, valid UUID, must exist

**Status Codes:**

- `201` - Assignment created
- `400` - Missing participant ID
- `401` - Unauthorized
- `404` - Participant or Round not found
- `500` - Server error

---

## 🔐 Authentication & Authorization

### JWT Token Structure

```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "role": "admin",
  "iat": 1760876861,
  "exp": 1760963261
}

Signature: HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  "brain-battle-jwt-secret-key"
)
```

### Using the Token

**In Request Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Expiration:** 24 hours
**Secret:** Stored in `JWT_SECRET` environment variable

---

## 🚀 Request/Response Examples

### Example 1: Complete Registration Flow

**Step 1: Register Participant**

```bash
curl -X POST http://localhost:4000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "phone": "9123456789",
    "college": "Tech University"
  }'
```

**Response:**

```json
{
  "success": true,
  "participant": {
    "id": "abc12345-def6-7890-ghij-klmnopqrstuv",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "code": "x9y8z7w6",
    "createdAt": "2025-10-19T14:22:30.000Z"
  },
  "qrDataUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA..."
}
```

**Step 2: Scan the Generated QR**

```bash
curl -X POST http://localhost:4000/api/register/scan \
  -H "Content-Type: application/json" \
  -d '{"code": "x9y8z7w6"}'
```

**Response:**

```json
{
  "success": true,
  "participant": {
    "id": "abc12345-def6-7890-ghij-klmnopqrstuv",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "code": "x9y8z7w6",
    "createdAt": "2025-10-19T14:22:30.000Z"
  }
}
```

---

### Example 2: Admin Tournament Setup

**Step 1: Admin Login**

```bash
curl -X POST http://localhost:4000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password": "brainbattle2025"}'
```

**Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Step 2: Create Round**

```bash
curl -X POST http://localhost:4000/api/admin/rounds \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"name": "Quarterfinals"}'
```

**Response:**

```json
{
  "success": true,
  "round": {
    "id": "round-uuid-1234-5678",
    "name": "Quarterfinals",
    "status": "pending",
    "createdAt": "2025-10-19T14:25:00.000Z"
  }
}
```

**Step 3: Assign Participant**

```bash
curl -X POST http://localhost:4000/api/admin/rounds/round-uuid-1234-5678/assign \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"participantId": "abc12345-def6-7890-ghij-klmnopqrstuv"}'
```

**Response:**

```json
{
  "success": true,
  "participantRound": {
    "id": "participant-round-uuid",
    "participantId": "abc12345-def6-7890-ghij-klmnopqrstuv",
    "roundId": "round-uuid-1234-5678",
    "status": "registered",
    "createdAt": "2025-10-19T14:26:00.000Z"
  }
}
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    USER INTERACTIONS                    │
└────────────────┬──────────────────┬─────────────────────┘
                 │                  │
         ┌───────▼────────┐  ┌─────▼──────────┐
         │  Registration  │  │  Event Admin   │
         │    (Public)    │  │   (Protected)  │
         └───────┬────────┘  └─────┬──────────┘
                 │                  │
    ┌────────────┼──────────────────┼────────────┐
    │            │                  │            │
    ▼            ▼                  ▼            ▼
  POST         GET              POST           GET
  /register    /register/:code  /admin/login  /admin/...
    │            │                  │            │
    ▼            ▼                  ▼            ▼
┌────────────────────────────────────────────────────┐
│          Express.js Server (TypeScript)           │
├────────────────────────────────────────────────────┤
│  ✓ Routes         ✓ Controllers    ✓ Middleware  │
│  ✓ Validation     ✓ Error Handler  ✓ Auth Check  │
└──────────────────┬───────────────────────────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
        ▼          ▼          ▼
    Generate   Store in   Serve QR
    QR Code    Database   Images
        │          │          │
        └──────────┼──────────┘
                   │
                   ▼
    ┌─────────────────────────────┐
    │   Prisma ORM                │
    │  (Type-safe DB Access)      │
    └──────────────┬──────────────┘
                   │
                   ▼
    ┌─────────────────────────────┐
    │   PostgreSQL Database       │
    │  • Participants             │
    │  • Rounds                   │
    │  • ParticipantRounds        │
    └─────────────────────────────┘
```

---

## 🔒 Security Features

| Feature              | Implementation       | Details                       |
| -------------------- | -------------------- | ----------------------------- |
| **HTTPS**            | Helmet.js            | HTTP security headers         |
| **CORS**             | CORS middleware      | Cross-origin requests control |
| **JWT Auth**         | jsonwebtoken         | Token-based admin auth        |
| **Password**         | Environment variable | Secure admin credentials      |
| **Input Validation** | Route handlers       | Validate all inputs           |
| **Error Handling**   | Global middleware    | Doesn't expose sensitive info |
| **SQL Injection**    | Prisma ORM           | Parameterized queries         |
| **Email Uniqueness** | Database constraint  | Prevent duplicates            |
| **Code Uniqueness**  | nanoid + validation  | 8-char unique codes           |

---

## 📈 Performance Considerations

| Factor               | Optimization              | Impact                    |
| -------------------- | ------------------------- | ------------------------- |
| **QR Generation**    | On-demand + file caching  | Reduces compute time      |
| **Database Queries** | Indexed unique fields     | O(1) lookups              |
| **File Serving**     | Express static middleware | Optimized QR delivery     |
| **Middleware Stack** | Helmet, CORS              | Security without overhead |
| **JSON Web Tokens**  | 24h expiration            | Balanced security/UX      |

---

## 🚨 Error Codes Reference

| HTTP Code | Error Message            | Cause                   | Solution                     |
| --------- | ------------------------ | ----------------------- | ---------------------------- |
| 400       | Name and email required  | Missing fields          | Provide all required fields  |
| 400       | Email already registered | Duplicate email         | Use a different email        |
| 400       | Invalid payload format   | Bad JSON in scan        | Verify JSON format           |
| 400       | Participant ID required  | Missing field           | Include participantId        |
| 401       | Invalid credentials      | Wrong password          | Use correct admin password   |
| 401       | Authentication required  | No token provided       | Include Authorization header |
| 401       | Invalid token            | Expired/malformed token | Get new token from login     |
| 404       | Participant not found    | Invalid code/ID         | Verify participant exists    |
| 404       | Round not found          | Invalid round ID        | Verify round exists          |
| 500       | Internal server error    | Server issue            | Check server logs            |

---

## 📦 Deployment Configuration

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Server
PORT=4000
NODE_ENV=production

# Authentication
JWT_SECRET=your-secret-key-here
ADMIN_PASSWORD=brainbattle2025
```

### Database Setup

```bash
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run seed             # Populate seed data (optional)
```

### Build & Run

```bash
npm run build  # Build TypeScript
npm start      # Run production server
```

### Docker

```bash
docker compose up -d  # Start with PostgreSQL
```

---

## ✅ Final Checklist

- [x] All endpoints documented with examples
- [x] Request/response formats specified
- [x] Authentication flow explained
- [x] Error codes documented
- [x] Database schema documented
- [x] Tech stack listed
- [x] Security measures outlined
- [x] Performance optimizations noted
- [x] Deployment instructions included

---

**Project Status:** ✅ **PRODUCTION READY**
**Last Updated:** October 19, 2025
**API Version:** 1.0.0
**Backend Version:** 1.0.0
