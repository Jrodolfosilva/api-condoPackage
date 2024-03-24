import express, { Express,Request,Response } from "express";
import mongoose from "mongoose";
const Condominium = require('./models/Condominium')
const Resident = require('./models/Resident')
require('dotenv').config()

const app = express()

console.log(Condominium.find())



mongoose.connect(`mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS_DB}@login.ulxmouh.mongodb.net/`).then(()=>{
    app.listen(3000,()=>{
        console.log("Server on Fire👌: http://localhost:3000")
    })
}).catch((error)=>console.log(error))
