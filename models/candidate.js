const mongoose = require('mongoose')

const candidateSchema = new mongoose.Schema({

    name:{
        type:string,
        required:true
    },
    party:{
        type:string,
        require:true
    },
    age:{
        type:Number,
        required:true
    },
    votes:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
                required:true

            },
            votedAt:{
                type:Date,
                default : Date.now()
            }
        }
    ]
})

const Candidate = mongoose.model('Candidate', 'candidateSchema')
module.exports = Candidate