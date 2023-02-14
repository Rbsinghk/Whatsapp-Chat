const mongoose = require("mongoose");
const userMessage = new mongoose.Schema({
  from: String,
  to: String,
  message: String,
  date: String,
  time: String,
});
module.exports = mongoose.model("userMessage", userMessage);
