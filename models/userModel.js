const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true

    },
    age:{
        type:Number,required:true
    },
    mobile:{
        type:String,
        required:true
    },
    email:{
        type:String,

    },
    address:{
        type:String,
        required:true
    },
    aadharCardNumber:{ 
        type:Number,
        require:true,
        unique:true
    },
    password:{
        type:String,
         required:true
    },
    role:{
        type:String,
        enum:['voter','admin'],
        default:'voter'
    },
    isVoted:{
        type:Boolean,
        default:false
    }
})


const User = mongoose.model('User', userSchema)
module.exports = User