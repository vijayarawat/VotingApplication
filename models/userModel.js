const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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


//Creating the hashed password
userSchema.pre('save',async function(next)
{
    const user = this
    try{
        //Generate slat
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(user.password,salt);
        user.password = hashedPassword
        next()
    }
    catch(err)
    {
        return next(err);
    }
})

//compare password method used for login and other purpose 
userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        const isMatch = await bcrypt.compare(candidatePassword,this.password)
        return isMatch;
    }
    catch(err){
        throw err
    }
}


const User = mongoose.model('User', userSchema)
module.exports = User