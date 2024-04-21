import express, { Express,Request,Response } from "express";
import mongoose from "mongoose";
const auth =  require('./routes/auth')
const resident =  require('./routes/resident')
const pack = require('./routes/pakage')
var cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use('/auth',auth)
app.use('/resident',resident)
app.use('/package',pack)



mongoose.connect(`mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS_DB}@login.ulxmouh.mongodb.net/`).then(()=>{
    app.listen(5000,()=>{
        console.log("Server on Fire👌: http://localhost:5000")
    })
}).catch((error)=>console.log(error))
