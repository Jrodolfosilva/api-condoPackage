import express, { Express,Response,Request, NextFunction, json } from "express";
const Condominium = require('../models/Condominium')
const bcrypt = require("bcrypt")

interface Condominium {
    name: string;
    phone: string;
    email: string;
    password: string;
    address: string;
}



const route =  express()
route.use(json())


route.post('/',dateRegister,async(req,res)=>{
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

module.exports = route