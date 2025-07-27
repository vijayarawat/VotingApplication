require('dotenv').config();
const jsonwebtoken = require('jsonwebtoken')

const jwtAuthMiddleware = (req,res,next)=>{

    const token = req.headers.authorization.split(" ")[1]
    if(!token)
    {
        res.status(401).json({error:"Unauthorized"})
    }
    try{
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET)
        req.jwtPayload = decoded
        next()
    }
    catch(err)
    {
        console.log(err)
        res.status(404).json({error:"Internal Server Error"})
    }
}

 
const generateToken = (userData)=>{
    return jsonwebtoken.sign(userData , process.env.JWT_SECRET)
}

module.exports = {jwtAuthMiddleware,generateToken }