"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
function verifyToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const bearestoken = req.headers.authorization;
        const token = bearestoken === null || bearestoken === void 0 ? void 0 : bearestoken.split(" ")[1];
        if (!token) {
            console.log("Você precisa enviar o TOKEN no headers da requisição");
            res.status(401).json({
                'msg': 'Você precisa enviar o TOKEN no headers da requisição'
            });
            return;
        }
        try {
            const tokenId = yield jwt.verify(token, process.env.SECRET_APP);
            if (tokenId) {
                req.body.id = tokenId.id;
                console.log('TOKEN verificado e inserido no req.body');
                next();
            }
        }
        catch (error) {
            console.log(error);
            res.status(401).json({
                'msg': 'Não foi possivel verificar o seu token'
            });
            return;
        }
    });
}
module.exports = verifyToken;
