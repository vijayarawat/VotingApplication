const mongoose = require('mongoose')
const mongourl = "mongodb://localhost:27017/voting"

mongoose.connect(mongourl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

const db = mongoose.connection;
db.on('connected',()=>{
    console.log("Mongodb Connected")
})

db.on('error', (err)=>{
    console.log("mongodb connection error", err);
})

db.on('disconnected', ()=>{
    console.log("Mongodb Disconnected");
})

module.exports = db