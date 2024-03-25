import express, { Express,Response,Request, NextFunction, json } from "express";
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")
require('dotenv').config()
const Condominium = require('../models/Condominium')


interface Condominium {
    name: string;
    phone: string;
    email: string;
    password: string;
    address: string;
}


const auth =  express()
auth.use(json())


auth.post('/register',dateRegister,async(req,res)=>{
    const {
        name,email,password,address,phone
    } = req.body

    const passWordHash = await bcrypt.hash(password,10)
   
    await Condominium.create({
        name,
        phone,
        email,
        password:passWordHash,
        address
    }).then((resp:Condominium)=>{
        console.log(`Create user:${resp}`)
        res.status(200).json({
            'msg':'Usuário cadastrado com sucesso'
        })
    }).catch((error:Error)=>{
        console.log(`Erro ao criar novo usuário: ${error}`)

        res.status(401).json({
            'msg':'Não foi possivel criar o usuário, tente novamente mais tarde ou procure o suporte.'
        })
    })

  
})


auth.get('/login',async(req,res)=>{
    
    const {email, password} = req.body;

    if(!email||!password){
        console.log("Email ou senha não foi enviado");
        res.status(401).json({
            "msg":"Você precisa enviar: Email e Senha"
        })
        return
    }

    try {
        const userLogin = await Condominium.findOne({email:email});
        if(!userLogin){
            res.status(404).json({
                'msg':'Usuário não encontrado'
            })
            return
        }
        
        const SECRET =  process.env.SECRET_APP
        
        const token = jwt.sign({id:userLogin.id},SECRET,{expiresIn:18000}) //60ms*60 * 5m
        const refreshToken = jwt.sign({id:userLogin.id},SECRET,{expiresIn:54.000})//60ms*60 * 15m
        res.status(200).json({
            'msg':'Usuário logado com sucesso',
            'token':{
                'acess':`${token}`,
                'refresh':`${refreshToken}`
            }
        })


    } catch (error) {
        console.log(error)
        res.status(401).json({
            'msg':'Erro ao tentar localizar usuário'
        })
    }





})




//middleware
async function dateRegister(req:Request,res:Response,next:NextFunction){

    const {
        name,email,password,confirmPassword,address,phone
    } = req.body

    if(!name||!email||!password||!confirmPassword||!address||!phone){
        console.log('O usuário não mandou os dados necessários para criar um novo cadastro')
        res.status(404).json({
            'msg':'Você precisa enviar todos dos dados para cadastro'
        })

        return
    }

    const user = await Condominium.findOne({email:email})

    if(user){
        console.log("Usuário já foi cadastrado")
        res.status(401).json({
            'msg':'Usuário já está cadastrado!'
        })

        return
    }

    if(password !== confirmPassword){
        console.log("Senha não confere")
        res.status(401).json({
            'msg':'Suas senhas não confere, tente novamente'
        })
        return
    }
    
    next()
    

}




module.exports = auth