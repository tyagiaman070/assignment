const mongoose = require("mongoose");

const connectToDatabase = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then((data) => {
      console.log(`Connected to databse with server ${data.connection.host}`);
    });
};

module.exports = connectToDatabase;
