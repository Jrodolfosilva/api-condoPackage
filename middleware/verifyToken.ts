import { Express,Response,Request,NextFunction } from "express"
const jwt = require('jsonwebtoken')

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

module.exports = verifyToken