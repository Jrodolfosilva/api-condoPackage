import express,{ Express, Request,Response, json } from "express";
const verifyToken = require("../middleware/verifyToken")
const Pack = require('../models/Package')
const pack = express()
pack.use(json())




pack.get('list/',verifyToken,async(req,res)=>{
    const idCondominium = req.body.id

    try {

      const data =  JSON.stringify( await Pack.find({id_condominium:idCondominium}))

        res.status(200).json({
            'msg':'Consulta realizada com sucesso',
            'data':`${data}`
        })
        
    } catch (error) {
        console.log(error)

        res.status(404).json({
            'msg':'Erro no servidor, procure o suporte'
        })
    }
})

pack.get('list/:idPackage',verifyToken,async(req,res)=>{
    const idCondominium = req.body.id
    const idPackage = req.params.idPackage

    if(!idPackage){
        res.status(401).json({
            'msg':'Você precisa enviar o ID do Morador nos params!'
        })
    }

    try {

      const data =  JSON.stringify( await Pack.find({id_condominium:idCondominium,_id:idPackage}))

        res.status(200).json({
            'msg':'Consulta realizada com sucesso',
            'data':`${data}`
        })
        
    } catch (error) {
        console.log(error)

        res.status(404).json({
            'msg':'Erro no servidor, procure o suporte'
        })
    }
})

pack.get('/resident/:idResident',verifyToken,async(req,res)=>{
    const idCondominium = req.body.id
    const idResident = req.params.idResident

    if(!idResident){
        res.status(401).json({
            'msg':'Você precisa enviar o ID do Morador nos params!'
        })
        return
    }

    try {

      const data =  JSON.stringify( await Pack.find({id_condominium:idCondominium,id_resident:idResident,}))

        res.status(200).json({
            'msg':'Consulta realizada com sucesso',
            'data':`${data}`
        })
        
    } catch (error) {
       // console.log(error)
        console.log(idResident)
        res.status(404).json({
            'msg':'Erro no servidor, procure o suporte'
        })
    }
    
})

pack.patch('/update/:idPackage',verifyToken,async(req,res)=>{
   
    const idPackage = req.params.idPackage

    if(!idPackage){
        res.status(401).json({
            'msg':'Você precisar informar o ID da encomenda nos params'
        })
        return
    }

    const {name,type,checkout,checkin} = req.body

    try {
        const packageA = await Pack.findOne({_id:idPackage})
        if(!packageA){
            res.status(404).json({
                'msg':'Não foi possivel encontrar a encomenda, verifique a ID'
            })
        }

        await Pack.findByIdAndUpdate(idPackage,{
            name:name?name:packageA.name,
            type:type?type:packageA.type,
            checkout:checkout?checkout:packageA.checkout,
            checkin:checkin?checkin:packageA.checkin,


        })

        res.status(200).json({
            'msg': 'Encomenda atualizada com sucesso'
        })
        
    } catch (error) {
        console.log(error)
        res.status(404).json({
            'msg':'Não foi possível encontrar a encomenda, procure o suporte'
        })
    }

})

pack.patch('/checkin/:idPackage',verifyToken,async(req,res)=>{
   
    const idPackage = req.params.idPackage

    const quant = Object.keys(req.body)
    

    if(!idPackage || !req.body.checkin || quant.length < 2){
        res.status(401).json({
            'msg':'Você precisar informar o ID e Data de Checkin da encomenda nos params'
        })
        return
    }

    const {checkin,code} = req.body

    try {
        const packageA = await Pack.findOne({_id:idPackage,code:code})
        if(!packageA){
            res.status(404).json({
                'msg':'Não foi possivel encontrar a encomenda, verifique a ID'
            })
        }

        await Pack.findByIdAndUpdate(idPackage,{
            
            checkin:checkin?checkin:packageA.checkin,


        })

        res.status(200).json({
            'msg': 'Encomenda atualizada com sucesso'
        })
        
    } catch (error) {
        console.log(error)
        res.status(404).json({
            'msg':'Não foi possível encontrar a encomenda, procure o suporte'
        })
    }

})

pack.delete('delete/:idPackage',verifyToken,async(req,res)=>{
    const idPackage = req.params.idPackage
    
    if(!idPackage || Object.keys(req.body).length < 2){
        res.status(401).json({
            'msg':'Você precisa informar o ID da encomenda e o Token'
        })
    }

    try {
        await Pack.findByIdAndDelete(idPackage)

        res.status(200).json({
            'msg':'Encomenda excluida com sucesso!'
        })
        
    } catch (error) {
        res.status(401).json({
            'msg':'Não foi possivel excluir dados da encomenda, procure o suporte'
        })
    }
})



module.exports = pack