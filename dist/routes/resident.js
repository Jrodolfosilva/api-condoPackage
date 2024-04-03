"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importStar(require("express"));
require("dotenv").config();
const Resident = require('../models/Resident');
const verifyToken = require("../middleware/verifyToken");
const verifyReqBodyData = require('../middleware/verifyReqBodyData');
const resident = (0, express_1.default)();
resident.use((0, express_1.json)());
resident.get('/', verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.id;
    try {
        const moradores = JSON.stringify(yield Resident.find({ id_condominium: id }));
        console.log(moradores);
        res.status(200).json({
            'msg': `lista`,
            'data': `${moradores}`
        });
    }
    catch (error) {
        console.log(error);
        res.status(404).json({
            'msg': 'Não foi possível encontrar seus Residentes',
            'data': []
        });
    }
}));
resident.get('/:id', verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idResident = req.params.id;
    if (!idResident) {
        res.status(401).json({
            'msg': 'Você precisa passar o parametro url /:id'
        });
        return;
    }
    try {
        const morador = JSON.stringify(yield Resident.findOne({ _id: idResident }));
        console.log(morador);
        res.status(200).json({
            'msg': `lista`,
            'data': `${morador}`
        });
    }
    catch (error) {
        console.log(error);
        res.status(404).json({
            'msg': 'Não foi possível encontrar o Morador',
            'data': []
        });
    }
}));
resident.post('/register', verifyToken, verifyReqBodyData, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, phone, email, address } = req.body;
    if (!name || !phone || !email || address) {
        res.status(401).json({
            'msg': 'Você precisa enviar todos os dados de cadastro'
        });
        return;
    }
    try {
        const user = yield Resident.findOne({ email: email });
        if (user) {
            res.status(401).json({
                'msg': 'Morador já está cadastrado'
            });
            return;
        }
        yield Resident.create({
            id_condominium: id,
            name,
            phone,
            email,
            address
            //dados para o mongo
        })
            .then((resp) => {
            console.log('Morador cadastrado com sucesso');
            res.status(200).json({
                'msg': 'Morador cadastrado com sucesso',
                'morador': `${resp.name}`
            });
        });
    }
    catch (error) {
        console.log(error);
        res.status(401).json({
            'msg': 'Erro ao cadastrar Morador, Procure o suporte'
        });
    }
}));
resident.patch('/update/:id', verifyToken, verifyReqBodyData, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idUser = req.params.id;
    if (!idUser) {
        res.status(401).json({
            'msg': 'Você precisa enviar o id do morador via /:id'
        });
        return;
    }
    const { name, phone, address, email } = req.body;
    try {
        const user = yield Resident.findOne({ _id: idUser });
        if (!user) {
            res.status(401).json({
                'msg': 'Usuário não encontrado'
            });
            return;
        }
        const userUpdate = yield Resident.findByIdAndUpdate(idUser, {
            name: name ? name : user.name,
            phone: phone ? phone : user.phone,
            email: email ? email : user.email,
            address: address ? address : user.address
        });
        if (userUpdate) {
            res.status(200).json({
                'msg': 'Usuário atualizado com sucesso!'
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(401).json({
            'msg': 'Não foi possivel atualizar os dados do morador, procure o suporte'
        });
    }
}));
resident.delete('/delete/:id', verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idUser = req.params.id;
    if (!idUser) {
        res.status(401).json({
            'msg': 'Você precisar enviar o id do morador via /:id'
        });
        return;
    }
    try {
        const userClean = yield Resident.findByIdAndDelete(idUser);
        if (userClean) {
            console.log(userClean);
            res.status(200).json({
                'msg': 'Os dados do morador, foram Excluidos com sucesso'
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(401).json({
            'msg': 'Não foi possivel excluir o morador, procure o suporte'
        });
    }
}));
module.exports = resident;
