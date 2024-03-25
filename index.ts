import express, { Express,Request,Response } from "express";
import mongoose from "mongoose";
const routeSign =  require('./routes/sign')
require('dotenv').config()

const app = express()

app.use('/sign',routeSign)


mongoose.connect(`mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS_DB}@login.ulxmouh.mongodb.net/`).then(()=>{
    app.listen(3000,()=>{
        console.log("Server on Fire👌: http://localhost:3000")
    })
}).catch((error)=>console.log(error))
