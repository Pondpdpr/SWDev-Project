const mongoose = require("mongoose");
const config = require("./config");

module.exports.connectDB = async () => {
  mongoose.set("strictQuery", true);
  const conn = await mongoose.connect(config.mongodb.uri);

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};
