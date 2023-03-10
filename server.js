const app = require("./app");
require("dotenv").config();
const { connectDb } = require("./src/db/connection");

const PORT = process.env.PORT || 3000;

const server = async () => {
  try {
    await connectDb();

    app.listen(PORT, () => {
      console.log("Server running. Use our API on port: 3000");
    });

    console.log("Database connection successful");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

server();
