const mongoose = require("mongoose");
const userOnline = new mongoose.Schema({
  ID: String,
  name:String
});
module.exports = mongoose.model("onlineUser", userOnline);
