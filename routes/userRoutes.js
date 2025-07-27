const express = require('express');
const router = express.Router();
require('dotenv').config();
const User = require('../models/userModel')

const {jwtAuthMiddleware,generateToken } = require('../jwt')

const logRequest = (req, res, next) => {
    console.log(`${new Date().toLocaleString()} request made to: ${req.originalUrl}`);
    next();
};

router.post('/signup', async(req,res)=>{
    try{
        const data = req.body
        const role = req.body.role
        if(role =='admin')
        {
            const doesExist = await User.findOne({role:'admin'})
            if(doesExist)
                return res.status(402).json({message:"Admin already exist"})
        }
        // console.log(role)
        const newUser = new User(data)
        const response = await newUser.save()

        console.log("Person Saved successfully", response)

        const payload={
            id:response.id
        }
        console.log(JSON.stringify(payload))
        const token = generateToken(payload)
        console.log("Your token is ", token)

        res.status(200).json({"response":response, "token":token})
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:"Internal server Error"})
    }

})
 
router.post('/login', async (req,res)=>{
    try{
        const {aadharCardNumber, password} = req.body
        // console.log(aadharCardNumber, password)
        const user = await User.findOne({aadharCardNumber})

        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({Error:"Invalid username or password"})
        }
        return res.status(200).json({Message:"Login Successfull"})
     }
    catch(err){
        res.status(500).json({error:"Internal server Error"})
    }

})

router.get('/profile', jwtAuthMiddleware, async (req,res)=>{
    try{
        const userData = req.jwtPayload
        console.log("User Data : ",userData)

        const UserId = userData.id

        const user = await User.findById(UserId)

        res.status(200).json({user})
    }
    catch(err){
        res.status(500).json({error:"Internal server Error"})
    }
})


router.put('/profile/password',jwtAuthMiddleware,async (req,res)=>{
    try{
        const userId = req.user
        const {currentPassword, newPassword} = req.body
        const user = await User.findById(userId)

        if(!(await user.comparePassword(currentPassword)))
            return res.status(401).json({error:"Invalid Username or password"})

        user.password = newPassword;
        await user.save();

        console.log("Password updated")
        res.status(200).json({error:"Password Updated"})
    }
    catch(err){
        res.status(500).json({error:"Internal server Error"})
    }
})


module.exports = router