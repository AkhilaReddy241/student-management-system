require("dotenv").config();

console.log("SECRET_KEY:", process.env.JWT_SECRET);

const app = require("./app");
const connectDB = require("./config/db");

async function startServer() {
  try {
    console.log("=================================");
    console.log("ENVIRONMENT CHECK");
    console.log("=================================");
    console.log("PORT:", process.env.PORT);

    console.log(
      "JWT_SECRET EXISTS:",
      process.env.JWT_SECRET ? "true" : "false"
    );

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is missing from .env");
      process.exit(1);
    }

    console.log("JWT_SECRET: Loaded successfully");
    console.log("=================================");

    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ SERVER START ERROR:", error);
  }
}

startServer();