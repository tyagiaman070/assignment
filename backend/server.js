const app = require("./app");
// ? dot env stuff
const dotenv = require("dotenv");
// ? cloudinary stuff
const cloudinary = require("cloudinary");
// ? DB Import stuff
const connectToDatabase = require("../backend/config/databaseConnection");

// ? Handling uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to uncaught Exception`);
  process.exit(1);
});

// ? config
dotenv.config({ path: "backend/config/config.env" });

//  ? calling after dotenv config setup
connectToDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
  console.log(`server is running on ${process.env.PORT}`);
});

// ? unhandled Promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to unhandled Promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});
