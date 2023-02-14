require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOOSE_CONNECTION,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
mongoose.connection.once("open",()=>{
    console.log('Database is Connected');
})
mongoose.connection.on("error",(e)=>{
    console.log('Database is Not Connected',e);
})