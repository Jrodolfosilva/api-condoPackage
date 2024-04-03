"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function verifyReqBodyData(req, res, next) {
    const dataReqBody = Object.keys(req.body);
    if (dataReqBody.length <= 1) {
        res.status(401).json({
            'msg': 'Você precisar enviar dados para atualização'
        });
        return;
    }
    else {
        next();
    }
}
module.exports = verifyReqBodyData;
