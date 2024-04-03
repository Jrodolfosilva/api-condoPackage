import express,{ Express,Response,Request, json } from "express";
require("dotenv").config()
const Resident = require('../models/Resident')
const verifyToken =  require("../middleware/verifyToken")
const verifyReqBodyData = require('../middleware/verifyReqBodyData')
interface ResisdenteType {
    id_condominium:string,
    name:string,
    phone:string,
    email:string,
    address:string
}
const resident =  express()
resident.use(json())


resident.get('/',verifyToken,async(req,res)=>{
    const id =  req.body.id

    try {

        const moradores = JSON.stringify(await Resident.find({id_condominium:id}))
      
        console.log(moradores)

        res.status(200).json({
            'msg':`lista`,
            'data': `${moradores}`
        })
        
       
        
    } catch (error) {
        console.log(error)

        res.status(404).json({
            'msg':'Não foi possível encontrar seus Residentes',
            'data':[]
        })
    }
 
})

resident.get('/:id',verifyToken,async(req,res)=>{
    const idResident =  req.params.id
    let idCondominium = req.body.id
    console.log(typeof(idCondominium))
    if(!idResident){
        res.status(401).json({
            'msg':'Você precisa passar o parametro url /:id'
        })
        return
    }

    try {

        const morador = JSON.stringify(await Resident.findOne({_id:idResident,id_condominium:idCondominium}))
      
        console.log(morador)

        res.status(200).json({
            'msg':`lista`,
            'data': `${morador}`
        })
        
       
        
    } catch (error) {
        console.log(error)

        res.status(404).json({
            'msg':'Não foi possível encontrar o Morador',
            'data':[]
        })
    }
})

resident.post('/register',verifyToken,verifyReqBodyData,async(req,res)=>{

    const {id,name, phone,email,address} = req.body

    if(!name||!phone||!email||address){
        res.status(401).json({
            'msg':'Você precisa enviar todos os dados de cadastro'
        })
        return
    }

    try {
        const user =  await Resident.findOne({email:email,id_condominium:id})

        if(user){
            res.status(401).json({
                'msg':'Morador já está cadastrado'
            })

            return
        }

        await Resident.create({
            id_condominium:id,
            name,
            phone,
            email,
            address
            //dados para o mongo
        })
        .then((resp:ResisdenteType)=>{
            console.log('Morador cadastrado com sucesso')

            res.status(200).json({
                'msg':'Morador cadastrado com sucesso',
                'morador':`${resp.name}`
            })
        })
        


    } catch (error) {

        console.log(error)
        res.status(401).json({
            'msg':'Erro ao cadastrar Morador, Procure o suporte'
        })
        
    }

    
})

resident.patch('/update/:id',verifyToken,verifyReqBodyData,async(req,res)=>{
   const idUser =  req.params.id
   const idCondominium = req.body.id

   if(!idUser){
    res.status(401).json({
        'msg':'Você precisa enviar o id do morador via /:id'
    })
    return
   }
   const {name,phone,address,email} = req.body
  
   try {

    const user = await Resident.findOne({_id:idUser,id_condominium:idCondominium})

    if(!user){
        res.status(401).json({
            'msg':'Usuário não encontrado'
        })
        return
    }

    const userUpdate =  await Resident.findByIdAndUpdate(idUser,{
        name:name?name:user.name,
        phone:phone?phone:user.phone,
        email:email?email:user.email,
        address:address?address:user.address
    })

    if(userUpdate){
        res.status(200).json({
            'msg':'Usuário atualizado com sucesso!'
        })
    }

   } catch (error) {
    console.log(error)

    res.status(401).json({
        'msg':'Não foi possivel atualizar os dados do morador, procure o suporte'
    })
   }
   
})

resident.delete('/delete/:id',verifyToken,async(req,res)=>{
    const idUser = req.params.id

    if(!idUser){
        res.status(401).json({
            'msg':'Você precisar enviar o id do morador via /:id'
        })
        return
    }
    try {
        const userClean = await Resident.findByIdAndDelete(idUser)
        if(userClean){
            console.log(userClean)
            res.status(200).json({
                'msg':'Os dados do morador, foram Excluidos com sucesso'
            })
        }
    } catch (error) {
        console.log(error)
        res.status(401).json({
            'msg':'Não foi possivel excluir o morador, procure o suporte'
        })
    }
})






module.exports = resident


