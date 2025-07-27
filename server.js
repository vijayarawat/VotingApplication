require('dotenv').config();
const express = require('express')
const app = express()
const db = require('./db')


const {jwtAuthMiddleware,generateToken } = require('./jwt')

const logRequest = (req, res, next) => {
    console.log(`${new Date().toLocaleString()} request made to: ${req.originalUrl}`);
    next();
};
app.use(logRequest)

const bodyParser = require('body-parser')
app.use(bodyParser.json())
const PORT = process.env.PORT || 3000


//Import router files
const userRoutes = require('./routes/userRoutes')
const candidateRoutes = require('./routes/candidateRoutes')

//use the routers
app.use('/user',userRoutes)
app.use('/candidate', jwtAuthMiddleware, candidateRoutes)


//Listen to port

app.listen(PORT, ()=>{
    console.log("App listening to port number", PORT)
})