# 🧠 Brain Battle 3.0 Backend

A production-grade backend for the **Brain Battle 3.0 Tournament Registration System** using Express.js, TypeScript, Prisma, and PostgreSQL.

## 🎯 Project Goals

* Participant registration via `/api/register` (name + email required, optional phone/college).
* Each participant gets a **unique short code** (8 chars alphanumeric) stored in DB.
* A QR is generated (encoded JSON payload with `id`, `code`, `name`) and returned at registration (data URL) and also available as an image endpoint `/api/register/qr/:code`.
* A **scan endpoint** `/api/register/scan` accepts either a scanned `code` or the full QR `payload` and returns the participant data — useful when you scan the QR at event gates.
* Admin routes to list participants, create rounds and assign participants to rounds, protected by a very simple JWT mechanism (for demo; swap to proper auth for production).
* Prisma ORM + PostgreSQL for reliable relational data (participants, rounds, participant_round mapping).
* Docker Compose included to spin up a Postgres DB quickly.
* Production-grade folder structure with TypeScript, build scripts, and a Dockerfile.

## 🔧 Key Design Decisions

* **Prisma**: strong typing, migrations, and easy relation handling (fits college event use-case).
* **UUIDs** for primary keys — stable, safe across multiple services.
* **Short unique `code`** (nanoid) instead of exposing DB id — easier and safer to encode on QR and scan.
* **QR payload** contains the `code` and some basic info; scanning the QR yields the code which resolves to a DB entry (so QR theft alone doesn't leak full DB).
* **QR generation on demand**: saves storage and lets front-end render `dataURL` or GET the PNG at `/api/register/qr/:code`.
* **Rounds model**: supports multiple rounds and assignment of participants, status per participant per round (registered/passed/eliminated).
* **Admin endpoints** are JWT protected using `JWT_SECRET` and `ADMIN_PASSWORD` env vars for quick setup. Replace with a full user system when needed.

## 📡 API Endpoints

### Participant Registration
* `POST /api/register` — body `{ name, email, phone?, college? }` → creates participant and returns `{ participant, qrDataUrl }`.

### QR Code Management
* `GET /api/register/:code` — returns participant data by code.
* `GET /api/register/qr/:code` — returns PNG image of QR for that code.
* `POST /api/register/scan` — body `{ code }` *or* `{ payload }` → returns `{ participant }`.

### Admin Authentication
* `POST /api/admin/login` — body `{ password }` → returns `{ token }` (use as `Authorization: Bearer <token>`).

### Admin Management
* `GET /api/admin/participants` — admin-only: list participants.
* `POST /api/admin/rounds` — admin-only: create round.
* `POST /api/admin/rounds/:roundId/assign` — admin-only: assign participant to round.

## 🛡️ Security & Production Notes

* Replace `ADMIN_PASSWORD` with a proper admin user(s) + secure password hashing / OAuth.
* Use HTTPS in production and rotate `JWT_SECRET`.
* Consider rate-limiting and CAPTCHA on registration to avoid spam.
* If you want QR tamper-detection, sign the payload (HMAC) and verify signature when scanning.
* Optionally store generated QR images in object storage if you expect heavy repeated downloads.

## 🚀 Quick Local Setup

1. Clone the repository
2. Copy `.env.example` → `.env` and adjust values if needed
3. Start Postgres (recommended): `docker compose up -d` (or use your DB)
4. Install deps: `npm install`
5. Generate Prisma client: `npm run prisma:generate`
6. Run migrations: `npm run prisma:migrate`
7. Seed sample data: `npm run seed`
8. Start dev server: `npm run dev`

## 🧪 Testing the API

After starting the server:

* Register: `POST http://localhost:4000/api/register` with JSON body:
  ```json
  {
    "name": "Tanmay",
    "email": "tanmay@example.com",
    "phone": "9999999999",
    "college": "XYZ"
  }
  ```

* Get QR image: `GET http://localhost:4000/api/register/qr/<CODE>`

* Scan: `POST http://localhost:4000/api/register/scan` with:
  ```json
  {
    "code": "<CODE>"
  }
  ```

* Admin login: `POST http://localhost:4000/api/admin/login` with:
  ```json
  {
    "password": "brainbattle2025"
  }
  ```

* List participants: `GET http://localhost:4000/api/admin/participants` (with Authorization header)

## 🐳 Docker Deployment

1. Build and start services: `docker compose up -d`
2. Run migrations: `docker compose exec app npm run prisma:migrate`
3. Seed data: `docker compose exec app npm run seed`

## 🏗️ Development Scripts

* `npm run dev` - Start development server with hot reload
* `npm run build` - Compile TypeScript to JavaScript
* `npm start` - Start production server
* `npm run prisma:generate` - Generate Prisma Client
* `npm run prisma:migrate` - Run database migrations
* `npm run seed` - Seed database with sample data

## 📁 Project Structure

```
src/
├── app.ts              # Express app instance
├── server.ts           # Server bootstrap and listener
├── config/
│   └── db.ts           # Database connection (Prisma)
├── controllers/
│   ├── registrationController.ts
│   └── adminController.ts
├── middleware/
│   ├── auth.ts
│   ├── errorHandler.ts
│   └── notFound.ts
├── routes/
│   ├── registrationRoutes.ts
│   └── adminRoutes.ts
├── utils/
│   └── qrGenerator.ts
prisma/
├── schema.prisma       # Prisma models
├── seed.ts             # Seed script
└── migrations/         # Database migrations
```

## 🔐 Environment Variables

See `.env.example` for all required environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.
