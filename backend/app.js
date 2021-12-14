const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const errorMiddleware = require("./middlewares/error");

// ? to tell that we will use JSON
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

// ?Routes Imports
const user = require("./routes/userRoute");

// ? Product API
app.use("/api/v1", user);

// ! test API
app.use("/api/v1/test-api", (req, res) => {
  res.status(200).json({
    message: "TEST ROUTE IS WORKING GREAT",
  });
});

// ?MiddleWare for Errors
app.use(errorMiddleware);

module.exports = app;
