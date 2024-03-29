import express,{ Express,Response,Request, json } from "express";
require("dotenv").config()
const Resident = require('../models/Resident')


const resident =  express()
resident.use(json())

//lista morador por id do condominio

//cadastrar morador vinculando com o condomonio - seção atual

// Excluir morador por id do morador e condomínio

// Atualizar dados do morador por id do morador e condomínio



resident.get('/',(req,res)=>{
    res.json({
        'msg':'Todos os usuários'
    })
})





module.exports = resident


