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


auth.post('/register',verifyDateRegister,async(req,res)=>{
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


auth.patch('/update',verifyToken, async(req,res)=>{
    
   const userId = req.body.id

   try {
        const user =  await Condominium.findOne({_id:userId})

        if(!user){
            console.log('Usuário não foi encontrado')

            res.status(404).json({
                'msg':'O usuário não foi encontrado'
            })

            return
        }

        const {
            name,email,oldPassword,password,confirmPassword,address,phone
        } = req.body
        const setUpdatePassword = oldPassword || password || confirmPassword
       
        const oldPasswordHash = await bcrypt.compare(oldPassword,user.password)

        if(setUpdatePassword && !oldPasswordHash || password !== confirmPassword){
            console.log('Veio dados para alteração de senha mas oldpassword não confere com user.password ou password != confirmPassword')

            res.status(401).json({
                'msg':'Para atualizar a senha você precisar enviar a senha atual, nova senha e confirmar a nova senha',
                'resul':`hash banco:${user.password}, ${user.id} e ${user.name}  ----  hash old:${oldPasswordHash}`
            })
            return
        }
                   
        const newPasswordHash = await bcrypt.hash(password,10)

        const setUpdate = await Condominium.findByIdAndUpdate(
                userId,
                {
                    name:name?name:user.name,
                    email:email?email:user.email,
                    password:newPasswordHash?newPasswordHash:user.password,
                    phone: phone?phone:user.phone,
                    address: address?address:user.address               
                }
            )

        if(setUpdate){
            console.log(`As informações do usuário foram atualizadas com sucesso: ${setUpdate}`);

            res.status(200).json({
                'msg':'Usuário atualizado com sucesso',
                    
                })
            }


        
   } catch (error) {
    // Pegar error

    console.log(error)
   }

   

})





//middleware
async function verifyDateRegister(req:Request,res:Response,next:NextFunction){

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

async function verifyToken(req:Request,res:Response,next:NextFunction){
    const bearestoken =  req.headers.authorization
    const token = bearestoken?.split(" ")[1]

    if(!token){
        console.log("Você precisa enviar o TOKEN no headers da requisição")

        res.status(401).json({
            'msg':'Você precisa enviar o TOKEN no headers da requisição'
        })

        return
    }

    try {
        const tokenId = await jwt.verify(token,process.env.SECRET_APP)
    
        if(tokenId){
            req.body.id=tokenId.id
            console.log('TOKEN verificado e inserido no req.body')
            next()
        }
       
    } catch (error) {
        console.log(error)

        res.status(401).json({
            'msg':'Não foi possivel verificar o seu token'
        })

        return
    }
   
}

module.exports = auth