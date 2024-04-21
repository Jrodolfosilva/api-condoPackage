import express,{ Express,Response,Request, NextFunction } from "express"

function verifyReqBodyData (req:Request,res:Response,next:NextFunction){
    const dataReqBody = Object.keys(req.body)
    if(dataReqBody.length <= 1){
        res.status(401).json({
        'msg':'Você precisar enviar dados para atualização'
        })

        return

    }

  next()


   
}

module.exports = verifyReqBodyData