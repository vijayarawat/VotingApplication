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


// Lets start voting
router.post('/vote/:candidateId', jwtAuthMiddleware, async(req,res)=>{
    //No admin can vote
    //User can vote only once
    //When user votes the count should be added to the candidate table



    try{
        const candidateId = req.params.candidateId
        const userId = req.jwtPayload.id
        const candidate = await Candidate.findById(candidateId)
        if(!candidate)
            return res.status(400).json({message:"Candidate not found"})

        const user = await User.findById(userId)
        if(!user)
            return res.status(400).json({message:"User not found"})
        if(user.isVoted)
            return res.status(400).json({message:"User already voted"})
        if(user.rol=="admin")
            return res.status(400).json({message:"Admin can not vote"})

        candidate.votes.push({user:userId})
        candidate.voteCount++
        candidate.save()

        user.isVoted = true
        user.save()

        res.status(200).json({message:"voted successfully"})

    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }

})

// //Get vote coun
//login via authentication token. Only signed up users can see the count
router.get('/vote/count', async(req,res)=>{
    try{

        const candidate = await Candidate.find().sort({voteCount:'desc'});
        const voteRecord = candidate.map((data)=>{
            return{
                party:data.party,
                count:data.voteCount
            }
        })
        res.status(200).json(voteRecord);
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})

    }
})

module.exports = router;