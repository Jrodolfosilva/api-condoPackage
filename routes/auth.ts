import express, { Express,Response,Request, NextFunction, json } from "express";
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")
require('dotenv').config()
const Condominium = require('../models/Condominium')
const verifyToken = require('../middleware/verifyToken')


interface Condominium {
    name: string;
    phone: string;
    email: string;
    password: string;
    address: string;
}


const auth =  express()
auth.use(json())


auth.post('/register',verifyDataRegister,async(req,res)=>{
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
        const isPassword = await  bcrypt.compare(password,userLogin.password)

        if(isPassword){
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
    
        }else{
            res.status(401).json({
                'msg':'Sua senha não confere'
            })
        }
       

    } catch (error) {
        console.log(error)
        res.status(401).json({
            'msg':'Erro ao tentar localizar usuário'
        })
    }





})


auth.patch('/update',verifyToken,verifyDataUpdatePassword, async(req,res)=>{
   const {name,newPasswordUpdate,phone,email,address,id} = req.body
  

   //Posso evitar essa req ao db, passando os dados via req.body da requisição do meyu middleware verifydataupdatePassword

   try {
        const user = await Condominium.findOne({_id:id})

            const userUpdate =  await Condominium.findByIdAndUpdate(id,{
                name: name?name:user.name,
                email: email?email:user.email,
                phone:phone?phone:user.phone,
                password:newPasswordUpdate?newPasswordUpdate:user.password,
                address:address?address:user.address
    
            })

            if(userUpdate){
                res.status(200).json({
                    'msg':'Seus dados foram atualizados'
                })
                return

            }
            

       
       
   } catch (error) {
    // Pegar error

    res.status(404).json({
        'msg':`Não foi possivel atualizar o Usuário: ID:${id}`
    })


    console.log(error)
   }

   

})





//middleware
async function verifyDataRegister(req:Request,res:Response,next:NextFunction){

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
async function verifyDataUpdatePassword(req:Request,res:Response,next:NextFunction){
    const dataReqBody = Object.keys(req.body)
    if(dataReqBody.length == 1){
        res.status(401).json({
         'msg':'Você precisar enviar dados para atualização'
        })

        return

    }
    const {oldPassword, password, confirmPassword,id} = req.body

    if(oldPassword || password || confirmPassword){
        
        if(!oldPassword){
            res.status(401).json({
                'msg':'Você precisa enviar sua SENHA ATUAL para criar uma nova'
            })
            return
        }
        if(!password || !confirmPassword){
            res.status(401).json({
                'msg':'Você precisa enviar sua SENHA NOVA e a CONFIRMAÇÃO'
            })
            return
        }

        if(password !== confirmPassword){
            res.status(401).json({
                'msg':'A NOVA SENHA e a CONFIRMAÇÃO não são iguais'
            })
            return
        }

        try {
            const user = await Condominium.findOne({_id:id});

            console.log(user)
           const verifyPasswordUser = await bcrypt.compare(oldPassword, user.password)

            if(verifyPasswordUser){

                const hashNewPassword =  await bcrypt.hash(password,10)
                req.body.newPasswordUpdate = hashNewPassword;
                console.log(`senha nova : ${hashNewPassword}`)

                next()

                return
            }
            else{
                req.body.newPasswordUpdate = false

                res.status(401).json({
                    'msg':'Senha atual invalida'
                })

                return

            }


            
        } catch (error) {
            console.log(error)

            res.status(401).json({
                'msg':'Não foi possivel validar sua identidade, tente novamente ou procure o suporte'
            })
        }
      
    }
    if(!oldPassword&&!password&&!confirmPassword){
        next()
    }

       

    
       

}


module.exports = auth