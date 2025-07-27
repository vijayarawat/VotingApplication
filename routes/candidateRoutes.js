require('dotenv').config();
const express = require('express');
const router = express.Router();

const User = require('../models/userModel')


const Candidate = require('../models/candidate')

const {jwtAuthMiddleware,generateToken } = require('../jwt')

const logRequest = (req, res, next) => {
    console.log(`${new Date().toLocaleString()} request made to: ${req.originalUrl}`);
    next();
};

const checkAdminRole = async(userId)=>{
    try{
        const user = await User.findById(userId)
        if(user.role =='admin')
            return true
        return false;
    }
    catch(err)
    {
        return false;
        // res.status(401).json({error:"User not found"})
    }
}

router.post('/', jwtAuthMiddleware, async( req,res)=>{
    try{
        console.log("Authenticated user:" ,req.jwtPayload);
        console.log("Request body:", req.body);
        const userID =  req.jwtPayload.id

        if(!(await checkAdminRole(req.jwtPayload.id)))
            return res.status(403).json({message:"User is not an andmin"})
        
        const data = req.body
        console.log(data.name)
        const newCandidate = new Candidate(data)
        const response  = await newCandidate.save();
        console.log("New candidate added")
        return res.status(200).json({message:"New candidate added successfully", Candidate_Data: response})
    }
    catch(err)
    {
        console.error("Error adding candidate:", err);
        res.status(500).json({error: "Internal Server Error"});
    }
})


router.put('/:candidateID', jwtAuthMiddleware, async(req,res)=>{
    try{
        if(!(await checkAdminRole(req.jwtPayload.id)))
            return res.status(403).json({message:"User is not an admin"})


        const candidateID = req.params.candidateID
        const updateCandidateData = req.body

        const response = await Candidate.findById(candidateID,updateCandidateData,{
            new:true,
            runvalidators:true
        })

        if(!response){
            return res.status(404).json({error:"Candidate not found"})
        }

        console.log("Candidate updated")
        res.status(200).json({message:"Candidate updated"})
    }
    catch(err){
        console.error("Error adding candidate:", err);
        res.status(500).json({error: "Internal Server Error"});
    }
})

router.delete('/:candidateId',jwtAuthMiddleware, async(req,res)=>{
    try{
        if(!await checkAdminRole(req.jwtPayload.id))
            res.status(403).json({message:"User is not admin"})

        const candidate = req.params.candidateId

        const response = await Candidate.findByIdAndDelete(candidate)
        if(!response){
            return res.status(404).json({error:"Candidate not found"})
        }

        console.log("Candidate deleted")
        res.status(200).json({message:"Candidate deleted"})

    }
    catch(err){
        onsole.error("Error adding candidate:", err);
        res.status(500).json({error: "Internal Server Error"});
    }
})
module.exports = router;