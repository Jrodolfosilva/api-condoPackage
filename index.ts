import express, { Express,Request,Response } from "express";
import mongoose from "mongoose";
const auth =  require('./routes/auth')
const resident =  require('./routes/resident')

require('dotenv').config()

const app = express()


app.use('/auth',auth)
app.use('/resident',resident)



mongoose.connect(`mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS_DB}@login.ulxmouh.mongodb.net/`).then(()=>{
    app.listen(3000,()=>{
        console.log("Server on Fire👌: http://localhost:3000")
    })
}).catch((error)=>console.log(error))
