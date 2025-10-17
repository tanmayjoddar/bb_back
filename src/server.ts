import app from "./app.js";
import dotenv from "dotenv";
import { prisma } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log(`✅ Database connected`);
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
});
