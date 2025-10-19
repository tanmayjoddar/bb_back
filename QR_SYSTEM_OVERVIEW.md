# Brain Battle - QR Code System Overview

## 🎯 System Architecture

This document explains how the QR code system works for participant verification in Brain Battle tournaments.

---

## 📋 User Journey & Flow

### **Phase 1: Participant Registration**

```
Participant Signs Up
    ↓
[POST] /api/register
    ↓
Backend creates participant with:
  - Unique ID (UUID)
  - Unique Code (8-character nanoid)
  - Name, Email, Phone, College
    ↓
Generate QR Code (contains: id, code, name)
    ↓
Two outputs:
  1. QR Data URL (base64 image) - sent to participant
  2. QR File (PNG) - saved to /qrcodes/{code}.png
    ↓
Participant receives response with:
  - Participant details
  - QR Data URL (can display on screen/app)
```

**API Response Example:**

```json
{
  "success": true,
  "participant": {
    "id": "uuid-1234",
    "name": "John Doe",
    "email": "john@example.com",
    "code": "abc12345",
    "createdAt": "2025-10-19..."
  },
  "qrDataUrl": "data:image/png;base64,iVBORw0KGgoAAAANS..."
}
```

---

### **Phase 2: Participant Receives QR Code**

The participant gets the QR code in their registration response. They can:

1. **Display on Mobile Device**

   - Show the base64 image received in `qrDataUrl`
   - Keep it ready for verification

2. **Download QR Code (Alternative)**
   - Access via: `GET /api/register/qr/{code}`
   - Returns PNG file: `/qrcodes/abc12345.png`

---

### **Phase 3: Event Day - Verification Process**

```
Participant arrives with QR Code
    ↓
Organizer/Admin scans QR using device
    ↓
QR contains JSON payload:
{
  "id": "uuid-1234",
  "code": "abc12345",
  "name": "John Doe"
}
    ↓
POST /api/register/scan
{
  "payload": "{\"id\":\"uuid-1234\",\"code\":\"abc12345\",\"name\":\"John Doe\"}"
}
    ↓
Backend verifies participant exists
    ↓
Response confirms participant details
    ↓
✅ Organizer verifies: "Yes, this is a legitimate participant"
    ↓
Admin records attendance/participation
```

---

## 🔄 Complete System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    BRAIN BATTLE EVENT SYSTEM                     │
└─────────────────────────────────────────────────────────────────┘

REGISTRATION PHASE (Before Event)
├─ Participant Registration
│  ├─ POST /api/register
│  ├─ Input: name, email, phone, college
│  ├─ Generate unique code (8 chars)
│  ├─ Generate QR Code (PNG file)
│  └─ Response: participant data + QR image
│
├─ QR Code Storage
│  ├─ PNG files stored in: /qrcodes/{code}.png
│  └─ Path saved in DB: participant.qrCode = "/qrcodes/abc12345.png"
│
└─ Participant Receives QR
   ├─ Gets base64 image in response
   ├─ Can display on phone/screen
   └─ Can download PNG if needed

EVENT DAY PHASE (Verification)
├─ Organizer Scans QR Code
│  ├─ Scanning device reads QR payload
│  ├─ Payload contains: {id, code, name}
│  └─ Organizer app sends to backend
│
├─ Backend Verifies
│  ├─ POST /api/register/scan
│  ├─ Extract code from payload
│  ├─ Query DB for participant
│  ├─ Verify participant exists
│  └─ Return participant details
│
├─ Verification Confirmation
│  ├─ Organizer sees: ✓ VERIFIED
│  ├─ Details match: Name, Code, College
│  └─ Record participation in system
│
└─ Admin Dashboard
   ├─ GET /api/admin/participants (with auth)
   ├─ View all registered participants
   ├─ View participation status
   └─ Create rounds and assign participants

ROUND MANAGEMENT PHASE
├─ Create Rounds (Admin)
│  ├─ POST /api/admin/rounds
│  └─ Input: round name
│
├─ Assign Participants to Rounds (Admin)
│  ├─ POST /api/admin/rounds/{roundId}/assign
│  ├─ Input: participantId
│  └─ Track participant progress through rounds
│
└─ Track Verification Status
   └─ participant_round table tracks:
      ├─ Which round each participant is in
      └─ Status: registered/verified/completed
```

---

## 🔐 Database Schema

```
┌─────────────────────┐
│    Participant      │
├─────────────────────┤
│ id (UUID)           │ ← Primary Key
│ name (String)       │
│ email (String)      │ ← Unique
│ phone (String?)     │
│ college (String?)   │
│ code (String)       │ ← Unique (8 chars)
│ qrCode (String)     │ ← Path to PNG file
│ createdAt           │
└─────────────────────┘
         │
         │ (has many)
         │
┌─────────────────────┐
│  ParticipantRound   │
├─────────────────────┤
│ id (UUID)           │
│ participantId (FK)  │
│ roundId (FK)        │
│ status (String)     │ ← "registered"
│ createdAt           │
└─────────────────────┘
         │
         │ (belongs to)
         │
    ┌────────────────┐
    │     Round      │
    ├────────────────┤
    │ id (UUID)      │
    │ name (String)  │
    │ status (String)│
    │ createdAt      │
    └────────────────┘
```

---

## 🌐 API Endpoints Summary

### **Registration Endpoints** (Public)

| Method | Endpoint                 | Purpose                 | Input                             |
| ------ | ------------------------ | ----------------------- | --------------------------------- |
| POST   | `/api/register`          | Register participant    | `{name, email, phone?, college?}` |
| GET    | `/api/register/:code`    | Get participant by code | -                                 |
| POST   | `/api/register/scan`     | Verify QR scan          | `{code OR payload}`               |
| GET    | `/api/register/qr/:code` | Download QR image       | -                                 |

### **Admin Endpoints** (Protected - JWT Required)

| Method | Endpoint                            | Purpose               | Input             |
| ------ | ----------------------------------- | --------------------- | ----------------- |
| POST   | `/api/admin/login`                  | Get admin token       | `{password}`      |
| GET    | `/api/admin/participants`           | List all participants | -                 |
| POST   | `/api/admin/rounds`                 | Create round          | `{name}`          |
| POST   | `/api/admin/rounds/:roundId/assign` | Assign to round       | `{participantId}` |

---

## 💾 QR Code Storage

### **File System Structure**

```
project_root/
├── qrcodes/
│   ├── abc12345.png
│   ├── def67890.png
│   ├── ghi11111.png
│   └── ...
```

### **Serving QR Codes**

```typescript
// Served via static middleware in app.ts
app.use("/qrcodes", express.static(path.join(process.cwd(), "qrcodes")));

// Access via browser: http://localhost:3000/qrcodes/abc12345.png
```

---

## 🔍 QR Code Payload

The QR code encodes a JSON string:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "code": "xyz98765",
  "name": "Jane Smith"
}
```

**This payload allows:**

- ✅ Unique identification of participant
- ✅ Quick lookup in database
- ✅ Verification of participant details
- ✅ No manual code entry needed

---

## 🚀 How Organizers Will Use It

### **Scenario: Event Day Verification**

1. **Before Event**

   - Participants register online
   - Each receives their unique QR code
   - Participants save/screenshot QR code

2. **At Event Entry**

   ```
   Participant: "Here's my QR code" (shows on phone)
        ↓
   Organizer: Uses mobile app/scanner to scan QR
        ↓
   Scanner reads: {id, code, name}
        ↓
   App sends to backend: POST /api/register/scan
        ↓
   Backend responds: "✓ Verified - Jane Smith from ABC College"
        ↓
   Organizer: Marks participant as verified in system
   ```

3. **Tracking Progress**
   - Admin views dashboard: GET /api/admin/participants
   - Can see all verified participants
   - Can assign to rounds as event progresses
   - Track which round each participant is in

---

## ✅ Security Features

| Feature                | How It Works                                                          |
| ---------------------- | --------------------------------------------------------------------- |
| **Unique Codes**       | 8-character codes with 62^8 possible combinations (over 200 trillion) |
| **UUID IDs**           | 128-bit universally unique identifiers                                |
| **Admin Auth**         | JWT tokens with 24-hour expiration                                    |
| **Email Uniqueness**   | Prevents duplicate registrations                                      |
| **Code Uniqueness**    | Each QR code is unique to one participant                             |
| **Password Protected** | Admin login requires password matching `ADMIN_PASSWORD` env var       |

---

## 🛠️ Configuration Requirements

Create `.env` file with:

```
DATABASE_URL=postgresql://user:password@localhost:5432/brainbattle
JWT_SECRET=your_secret_key_here_min_32_chars
ADMIN_PASSWORD=strong_admin_password
```

---

## 📊 Expected Workflow Timeline

```
Week Before Event:
  └─ Participants register online
     └─ Receive QR codes in email/app

Event Day - Morning:
  └─ Participants arrive with QR codes ready

Event Day - Check-in:
  └─ Organizers scan QR codes
  └─ Verify participant identity
  └─ Record attendance

Event Day - During Event:
  └─ Admin assigns participants to rounds
  └─ Tracks participation progress
  └─ Updates participant status

Event Day - Closing:
  └─ Final statistics generated
  └─ All participations recorded
```

---

## 🎯 Key Benefits of This System

✅ **Fast Verification** - Scan QR instead of manual lookup
✅ **Prevents Fraud** - QR codes are unique and verified against database
✅ **Mobile Friendly** - Participants show QR on phones
✅ **Scalable** - Works for 10s to 1000s of participants
✅ **Accurate Records** - All data stored in database with timestamps
✅ **Easy Admin Tracking** - Dashboard view of all participants
✅ **No Physical Tickets** - Fully digital system

---

## 🔄 Next Steps to Implement

1. **Create Frontend for Participant Registration**

   - Form with name, email, phone, college
   - Display QR code after registration
   - Option to download QR as image

2. **Create QR Scanner Interface**

   - Use mobile device camera with QR library
   - Send scan results to `/api/register/scan`
   - Display verification confirmation

3. **Create Admin Dashboard**

   - Login page (password protected)
   - Participant list view
   - Round management interface
   - Verification status display

4. **Mobile App (Optional)**
   - Participants: View QR code
   - Organizers: Scanner functionality
   - Real-time sync with backend

---

## 📝 Notes

- QR codes are generated on-demand during registration
- PNG files are stored on server for archival
- Base64 images are sent in API response for immediate display
- All participant data is encrypted in transit (use HTTPS in production)
- QR codes can be regenerated if needed
- System is ready for scale with proper infrastructure

---

**Status:** ✅ Backend ready for QR code generation and verification
**Next Phase:** Frontend implementation for scanning and display
