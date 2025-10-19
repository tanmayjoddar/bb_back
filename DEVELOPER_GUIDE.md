# 🧠 Brain Battle 3.0 Backend - Developer Documentation

**Last Updated:** October 19, 2025
**Backend Status:** ✅ Production Ready
**Database:** PostgreSQL (Railway.app)
**API Server:** Express.js + TypeScript
**Port:** 4000

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Tech Stack](#tech-stack)
3. [API Endpoints](#api-endpoints)
4. [Database Schema](#database-schema)
5. [Project Structure](#project-structure)
6. [Environment Setup](#environment-setup)
7. [Development Guide](#development-guide)
8. [Deployment](#deployment)

---

## 🚀 Quick Start

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npm run prisma:generate

# 3. Run migrations (database setup)
npm run prisma:migrate

# 4. Seed sample data (optional)
npm run seed

# 5. Start dev server
npm run dev
# OR for production build
npm run build
npm start
```

### Test Endpoints

```bash
# Server runs on: http://localhost:4000

# Register a participant
curl -X POST http://localhost:4000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@test.com","phone":"1234567890","college":"MIT"}'

# Admin login
curl -X POST http://localhost:4000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"brainbattle2025"}'
```

---

## 🛠️ Tech Stack

### Backend Framework & Language

- **Node.js** (v18+)
- **Express.js** v4.18.2 - HTTP server & routing
- **TypeScript** v5.9.3 - Type-safe JavaScript
- **nodemon** v3.0.1 - Hot reload for development

### Database & ORM

- **PostgreSQL** - Relational database (Railway.app hosted)
- **Prisma** v5.0.0 - ORM with migrations & type safety
- **@prisma/client** v5.0.0 - Generated client library

### Security & Middleware

- **jsonwebtoken** v9.0.2 - JWT authentication
- **bcrypt** (if needed) - Password hashing
- **helmet** v7.0.0 - HTTP security headers
- **cors** v2.8.5 - Cross-origin resource sharing

### Utilities

- **nanoid** v5.1.6 - Unique ID generation (8-char codes)
- **qrcode** v1.5.3 - QR code generation
- **morgan** v1.10.0 - HTTP request logging
- **dotenv** v16.3.1 - Environment variables

### Development Tools

- **ts-node** v10.9.2 - Run TypeScript directly
- **ESM (ES Modules)** - Modern JavaScript module system

---

## 📡 API Endpoints

### Base URL

```
http://localhost:4000/api
```

### Registration Endpoints

#### 1. Register New Participant

```
POST /register
Content-Type: application/json

Request Body:
{
  "name": "string (required)",
  "email": "string (required, unique)",
  "phone": "string (optional)",
  "college": "string (optional)"
}

Response (201 Created):
{
  "success": true,
  "participant": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "phone": "string or null",
    "college": "string or null",
    "code": "8-char unique code",
    "createdAt": "ISO-8601 timestamp"
  },
  "qrDataUrl": "data:image/png;base64,..." // Base64 encoded QR code
}

Status Codes:
- 201: Successfully registered
- 400: Missing required fields or email already exists
- 500: Server error
```

**Example:**

```bash
curl -X POST http://localhost:4000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Smith",
    "email": "alice@test.com",
    "phone": "9876543210",
    "college": "MIT"
  }'
```

#### 2. Get Participant by Code

```
GET /register/:code

URL Parameters:
- code: 8-character unique participant code (string)

Response (200 OK):
{
  "success": true,
  "participant": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "phone": "string or null",
    "college": "string or null",
    "code": "8-char code",
    "createdAt": "ISO-8601 timestamp"
  }
}

Status Codes:
- 200: Success
- 404: Participant not found
- 500: Server error
```

**Example:**

```bash
curl http://localhost:4000/api/register/PB6KZ2Pu
```

#### 3. Get QR Code Image

```
GET /register/qr/:code

URL Parameters:
- code: 8-character unique participant code (string)

Response (200 OK):
- Returns PNG image file (image/png)

Status Codes:
- 200: Success (PNG image)
- 404: Participant not found
- 500: Server error
```

**Example:**

```bash
# Download QR code image
curl http://localhost:4000/api/register/qr/PB6KZ2Pu > qr-code.png

# Or use in HTML
<img src="http://localhost:4000/api/register/qr/PB6KZ2Pu" alt="QR Code" />
```

#### 4. Scan QR Code

```
POST /register/scan
Content-Type: application/json

Request Body (Option 1 - Direct Code):
{
  "code": "8-char unique code"
}

Request Body (Option 2 - From Payload):
{
  "payload": "{\"id\":\"uuid\",\"code\":\"8-char\",\"name\":\"string\"}"
}

Response (200 OK):
{
  "success": true,
  "participant": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "phone": "string or null",
    "college": "string or null",
    "code": "8-char code",
    "createdAt": "ISO-8601 timestamp"
  }
}

Status Codes:
- 200: Success
- 400: Invalid code/payload
- 404: Participant not found
- 500: Server error
```

**Example:**

```bash
curl -X POST http://localhost:4000/api/register/scan \
  -H "Content-Type: application/json" \
  -d '{"code":"PB6KZ2Pu"}'
```

---

### Admin Endpoints (Protected)

All admin endpoints require JWT authentication:

```
Authorization: Bearer <jwt_token>
```

#### 1. Admin Login

```
POST /admin/login
Content-Type: application/json

Request Body:
{
  "password": "string"
}

Response (200 OK):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // JWT token (24h expiry)
}

Status Codes:
- 200: Login successful
- 401: Invalid password
- 500: Server error

Note: Default password is "brainbattle2025" (from environment)
```

**Example:**

```bash
curl -X POST http://localhost:4000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"brainbattle2025"}'
```

#### 2. Get All Participants (Admin Only)

```
GET /admin/participants
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "participants": [
    {
      "id": "uuid",
      "name": "string",
      "email": "string",
      "phone": "string or null",
      "college": "string or null",
      "code": "8-char code",
      "createdAt": "ISO-8601 timestamp"
    },
    ...
  ]
}

Status Codes:
- 200: Success
- 401: Unauthorized (missing/invalid token)
- 500: Server error
```

**Example:**

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
curl http://localhost:4000/api/admin/participants \
  -H "Authorization: Bearer $TOKEN"
```

#### 3. Create Tournament Round (Admin Only)

```
POST /admin/rounds
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "name": "string (required, e.g., 'Semifinals', 'Finals')"
}

Response (201 Created):
{
  "success": true,
  "round": {
    "id": "uuid",
    "name": "string",
    "status": "pending",
    "createdAt": "ISO-8601 timestamp"
  }
}

Status Codes:
- 201: Round created successfully
- 400: Missing round name
- 401: Unauthorized
- 500: Server error
```

**Example:**

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
curl -X POST http://localhost:4000/api/admin/rounds \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Finals"}'
```

#### 4. Assign Participant to Round (Admin Only)

```
POST /admin/rounds/:roundId/assign
Authorization: Bearer <token>
Content-Type: application/json

URL Parameters:
- roundId: UUID of the round (string)

Request Body:
{
  "participantId": "uuid (required)"
}

Response (201 Created):
{
  "success": true,
  "participantRound": {
    "id": "uuid",
    "participantId": "uuid",
    "roundId": "uuid",
    "status": "registered",
    "createdAt": "ISO-8601 timestamp"
  }
}

Status Codes:
- 201: Assignment successful
- 400: Missing participantId
- 401: Unauthorized
- 404: Participant or Round not found
- 500: Server error
```

**Example:**

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
ROUND_ID="3be5b050-3621-4acc-9190-2de52cde7ddc"
PARTICIPANT_ID="4afc1946-381c-47fc-b8a3-4c315baf7ef4"

curl -X POST http://localhost:4000/api/admin/rounds/$ROUND_ID/assign \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"participantId\":\"$PARTICIPANT_ID\"}"
```

---

## 🗄️ Database Schema

### Prisma Data Models

#### Participant Model

```prisma
model Participant {
  id          String      @id @default(uuid())        // UUID primary key
  name        String                                   // Required: Full name
  email       String      @unique                      // Required: Unique email
  phone       String?                                  // Optional: Phone number
  college     String?                                  // Optional: College/University
  code        String      @unique                      // Required: 8-char unique code (nanoid)
  qrCode      String                                   // QR code file path
  createdAt   DateTime    @default(now())              // Registration timestamp
  rounds      ParticipantRound[]                       // Relation to rounds
}
```

#### Round Model

```prisma
model Round {
  id          String      @id @default(uuid())        // UUID primary key
  name        String                                   // Round name (e.g., "Finals")
  status      String      @default("pending")          // Round status
  createdAt   DateTime    @default(now())              // Creation timestamp
  participants ParticipantRound[]                      // Relation to participants
}
```

#### ParticipantRound Model (Junction Table)

```prisma
model ParticipantRound {
  id              String      @id @default(uuid())    // UUID primary key
  participantId   String                               // Foreign key to Participant
  roundId         String                               // Foreign key to Round
  status          String      @default("registered")   // Status: registered/passed/eliminated
  createdAt       DateTime    @default(now())          // Assignment timestamp

  participant     Participant @relation(fields: [participantId], references: [id])
  round           Round       @relation(fields: [roundId], references: [id])

  @@unique([participantId, roundId])                   // Prevent duplicate assignments
}
```

### Database Relationships

```
┌─────────────────┐
│   Participant   │
├─────────────────┤
│ id (PK, UUID)   │
│ name            │
│ email (unique)  │
│ phone           │
│ college         │
│ code (unique)   │ ◄──── 8-char nanoid
│ qrCode          │
│ createdAt       │
└────────┬────────┘
         │ (1:M)
         │
    ┌────▼──────────────┐
    │ ParticipantRound   │
    ├────────────────────┤
    │ id (PK, UUID)      │
    │ participantId (FK) │
    │ roundId (FK)       │
    │ status             │
    │ createdAt          │
    └────┬──────────────┬┘
         │ (M:1)        │ (M:1)
         │              │
    ┌────▼─────┐   ┌────▼─────┐
    │ Participant   │ Round
    └──────────┘   └───────────┘
         │              │
         └──────┬───────┘
                │
        Many-to-Many via
        ParticipantRound
```

---

## 📁 Project Structure

```
brain-battle-backend/
│
├── src/                          # TypeScript source code
│   ├── app.ts                   # Express app initialization
│   ├── server.ts                # Server startup & DB connection
│   │
│   ├── config/
│   │   └── db.ts                # Prisma client initialization
│   │
│   ├── controllers/              # Business logic
│   │   ├── registrationController.ts
│   │   └── adminController.ts
│   │
│   ├── routes/                   # Route definitions
│   │   ├── registrationRoutes.ts
│   │   └── adminRoutes.ts
│   │
│   ├── middleware/               # Express middleware
│   │   ├── auth.ts              # JWT authentication
│   │   ├── errorHandler.ts      # Global error handler
│   │   └── notFound.ts          # 404 handler
│   │
│   └── utils/                    # Utility functions
│       └── qrGenerator.ts       # QR code generation
│
├── dist/                         # Compiled JavaScript (auto-generated)
│   ├── app.js
│   ├── server.js
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── utils/
│
├── prisma/                       # Database schema & migrations
│   ├── schema.prisma            # Prisma data models
│   ├── seed.ts                  # Seed script for sample data
│   └── migrations/              # Database migration files
│
├── qrcodes/                      # Generated QR code images (PNG)
│
├── .env                          # Environment variables (NOT in git)
├── .env.example                  # Template for env variables
├── .gitignore                    # Git ignore rules
│
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
├── nodemon.json                  # Nodemon configuration
│
├── docker-compose.yml            # Docker services (PostgreSQL)
├── Dockerfile                    # Container image definition
│
├── README.md                     # Project overview
├── IMPLEMENTATION_SUMMARY.md     # Completed features
├── FRONTEND_TODO.md              # Frontend developer guide
└── DEVELOPER_GUIDE.md            # This file
```

---

## 🔧 Environment Setup

### Environment Variables (.env)

Create a `.env` file in the project root (copy from `.env.example`):

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@host:port/database"

# Server Configuration
PORT=4000

# JWT Configuration
JWT_SECRET="your-secret-key-here"

# Admin Credentials
ADMIN_PASSWORD="brainbattle2025"

# Environment
NODE_ENV="development"
```

### Required Packages

All packages are defined in `package.json`:

```bash
npm install
```

**Key Dependencies:**

- `@prisma/client` - Database ORM
- `express` - HTTP server
- `jsonwebtoken` - JWT auth
- `qrcode` - QR generation
- `nanoid` - Unique IDs

---

## 💻 Development Guide

### Adding a New Endpoint

1. **Create/Update Controller** (`src/controllers/`)

   ```typescript
   export const myNewHandler = async (
     req: Request,
     res: Response,
     next: NextFunction
   ) => {
     try {
       // Logic here
       res.status(200).json({ success: true, data: result });
     } catch (err) {
       next(err); // Pass to error handler
     }
   };
   ```

2. **Add Route** (`src/routes/`)

   ```typescript
   router.post("/myendpoint", myNewHandler);
   ```

3. **Rebuild** and **Test**
   ```bash
   npm run build
   npm start
   # Then test the endpoint
   ```

### Making Database Changes

1. **Update Prisma Schema** (`prisma/schema.prisma`)

   ```prisma
   model MyModel {
     id    String   @id @default(uuid())
     name  String
   }
   ```

2. **Create Migration**

   ```bash
   npm run prisma:migrate
   # Provide a meaningful name like "add_mymodel"
   ```

3. **Regenerate Client**
   ```bash
   npm run prisma:generate
   ```

### Error Handling Pattern

```typescript
// In controller
try {
  if (!validation) {
    res.status(400);
    throw new Error("Validation failed");
  }
  const result = await prisma.model.operation();
  res.status(200).json({ success: true, data: result });
} catch (err) {
  next(err); // Goes to global error handler
}

// Global error handler catches and responds
// (middleware/errorHandler.ts)
```

### Testing Endpoints Locally

**Using PowerShell/curl:**

```bash
# Test endpoint
curl -X POST http://localhost:4000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com"}'
```

**Using test script:**

```bash
npm test
# or
./test-api.ps1
```

---

## 🚀 Deployment

### Production Build

```bash
# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
# Start all services (PostgreSQL + App)
docker-compose up -d

# Run migrations inside container
docker-compose exec app npm run prisma:migrate

# View logs
docker-compose logs -f app
```

### Environment for Production

Update `.env` with production values:

- Use strong `JWT_SECRET`
- Use strong `ADMIN_PASSWORD`
- Point `DATABASE_URL` to production PostgreSQL
- Set `NODE_ENV=production`

### Verifying Production Setup

```bash
# Check database connection
curl http://your-domain/api/admin/login

# Register test participant
curl -X POST http://your-domain/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com"}'
```

---

## 🧪 Testing Checklist

- [x] Registration endpoint creates participant with unique code
- [x] QR code generates and encodes payload
- [x] QR scan resolves participant by code
- [x] Admin login generates JWT token
- [x] Protected endpoints require valid token
- [x] Participant-Round assignment works
- [x] Database migrations run successfully
- [x] Error handling catches validation errors
- [x] Email uniqueness enforced
- [x] Code uniqueness enforced

---

## 🔐 Security Notes

### Current Implementation

- JWT tokens expire in 24 hours
- Admin password stored in environment
- Database uses PostgreSQL with SSL
- CORS enabled for frontend communication
- Helmet.js adds HTTP security headers

### Production Recommendations

1. **Replace simple password auth** with OAuth or proper user management
2. **Use environment-specific secrets** in production
3. **Enable HTTPS** on all endpoints
4. **Add rate limiting** to prevent abuse
5. **Implement request validation** with libraries like Joi or Zod
6. **Add API logging** for audit trails
7. **Use database backups** and recovery procedures

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Documentation](https://expressjs.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [JWT.io](https://jwt.io)
- [QRCode.js](https://davidshimjs.github.io/qrcodejs)

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes with proper TypeScript types
3. Test locally: `npm start`
4. Run migrations if database changed: `npm run prisma:migrate`
5. Commit with clear message: `git commit -m "feat: add new feature"`
6. Push and create pull request

---

**Need Help?** Check the README.md or reach out to the team.

**Last Updated:** October 19, 2025 ✅
