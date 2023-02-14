const express = require('express');
const app = express();
require('./config/db');
const path = require('path');
const bodyParser = require('body-parser')
const session = require("express-session");
const ejs = require('ejs')
const userMSG = require("./models/userMSG");
const onlineUser = require("./models/onlineUser");
const users = require("./models/user");
const moment = require("moment");


const port = process.env.PORT;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(session({ secret: "ChatV2", resave: false, saveUninitialized: true }));

//Import Route
const regRouter = require('./Routes/registerRoute');
const chatRouter = require('./Routes/chat');

//Route MiddleWare
app.use(regRouter);
// app.use(chatRouter);
const formatMessage = (data) => {
    msg = {
      from: data.fromUser,
      to: data.to,
      message: data.msg,
      date: moment().format("YYYY-MM-DD"),
      time: moment().format("hh:mm a"),
    };
    return msg;
  };
app.use(express.static("./public"))
var Oname = "";
const server = app.listen(port, () => {
    console.log(`The Port is Running at ${port}`);
})
var io = require("socket.io")(server);
io.on("connection", async (socket) => {
    console.log("New User Logged In with ID " + socket.id);
    var result1 = await users.find();
    socket.emit("userList", result1);
    //Collect message and insert into database
    socket.on("chatMessage", async (data) => {
      //recieves message from client-end along with sender's and reciever's details
      if (data.msg != " " && data.msg != "") {
        var dataElement = formatMessage(data);
        await userMSG.create(dataElement);
        socket.emit("message", dataElement);
      }
      let response = await onlineUser.findOne({ name: data.toUser });
      if (response != null) {
        socket.to(response.ID).emit("message", dataElement);
      }
    });
    socket.on("userDetails", async (data) => {
      var msglist = "";
      Oname = data.fromUser;
      //checks if a new user has logged in and recieves the established chat details
      var onlineuser = {
        //forms JSON object for the user details
        ID: socket.id,
        ChatRoom: data.ChatRoom,
        name: data.fromUser,
      };
      var myquery = {};
      myquery["$or"] = [{ ID: socket.id }, { name: data.fromUser }];
      const result = await onlineUser.findOne(myquery);
      msglist = await userMSG.find(
        {
          $or: [
            { from: data.fromUser, to: data.toUser },
            { from: data.toUser, to: data.fromUser },
          ],
        },
        { projection: { _id: 0 } }
      );
      var result12 = await users.find();
      socket.emit("output", msglist);
      socket.emit("userList", result12);
      if (result) {
        console.log(result.name + " is online...");
      } else {
        const chatresp = await onlineUser.create(onlineuser);
        console.log(chatresp.name + " is online...");
      }
    });
    var userID = socket.id;
    socket.on("disconnect", async () => {
      var myquery = {};
      myquery["$or"] = [{ ID: userID }, { name: Oname }];
      const result = await onlineUser.findOne(myquery);
      if (result) {
        Oname = "";
        await onlineUser.findByIdAndDelete(result.id);
        // await userMSG.deleteMany({ from: result.name });
        console.log("User " + userID + "went offline...");
      }
    });
    socket.on("clearchat", async (name) => {
      await userMSG.deleteMany({ from: name.name ,to:name.touser});
      console.log("User " + userID + "went offline...");
    });
  });
  