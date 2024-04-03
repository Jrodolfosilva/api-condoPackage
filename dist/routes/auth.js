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
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
require('dotenv').config();
const Condominium = require('../models/Condominium');
const verifyToken = require('../middleware/verifyToken');
const verifyReqBodyData = require('../middleware/verifyReqBodyData');
const auth = (0, express_1.default)();
auth.use((0, express_1.json)());
auth.post('/register', verifyReqBodyData, verifyDataRegister, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, address, phone } = req.body;
    const passWordHash = yield bcrypt.hash(password, 10);
    yield Condominium.create({
        name,
        phone,
        email,
        password: passWordHash,
        address
    }).then((resp) => {
        console.log(`Create user:${resp}`);
        res.status(200).json({
            'msg': 'Usuário cadastrado com sucesso'
        });
    }).catch((error) => {
        console.log(`Erro ao criar novo usuário: ${error}`);
        res.status(401).json({
            'msg': 'Não foi possivel criar o usuário, tente novamente mais tarde ou procure o suporte.'
        });
    });
}));
auth.get('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        console.log("Email ou senha não foi enviado");
        res.status(401).json({
            "msg": "Você precisa enviar: Email e Senha"
        });
        return;
    }
    try {
        const userLogin = yield Condominium.findOne({ email: email });
        if (!userLogin) {
            res.status(404).json({
                'msg': 'Usuário não encontrado'
            });
            return;
        }
        const isPassword = yield bcrypt.compare(password, userLogin.password);
        if (isPassword) {
            const SECRET = process.env.SECRET_APP;
            const token = jwt.sign({ id: userLogin.id }, SECRET, { expiresIn: 18000 }); //60ms*60 * 5m
            const refreshToken = jwt.sign({ id: userLogin.id }, SECRET, { expiresIn: 54.000 }); //60ms*60 * 15m
            res.status(200).json({
                'msg': 'Usuário logado com sucesso',
                'token': {
                    'acess': `${token}`,
                    'refresh': `${refreshToken}`
                }
            });
        }
        else {
            res.status(401).json({
                'msg': 'Sua senha não confere'
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(401).json({
            'msg': 'Erro ao tentar localizar usuário'
        });
    }
}));
auth.patch('/update', verifyToken, verifyReqBodyData, verifyDataUpdatePassword, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, newPasswordUpdate, phone, email, address, id } = req.body;
    //Posso evitar essa req ao db, passando os dados via req.body da requisição do meyu middleware verifydataupdatePassword
    try {
        const user = yield Condominium.findOne({ _id: id });
        const userUpdate = yield Condominium.findByIdAndUpdate(id, {
            name: name ? name : user.name,
            email: email ? email : user.email,
            phone: phone ? phone : user.phone,
            password: newPasswordUpdate ? newPasswordUpdate : user.password,
            address: address ? address : user.address
        });
        if (userUpdate) {
            res.status(200).json({
                'msg': 'Seus dados foram atualizados'
            });
            return;
        }
    }
    catch (error) {
        // Pegar error
        res.status(404).json({
            'msg': `Não foi possivel atualizar o Usuário: ID:${id}`
        });
        console.log(error);
    }
}));
//middleware
function verifyDataRegister(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email, password, confirmPassword, address, phone } = req.body;
        if (!name || !email || !password || !confirmPassword || !address || !phone) {
            console.log('O usuário não mandou os dados necessários para criar um novo cadastro');
            res.status(404).json({
                'msg': 'Você precisa enviar todos dos dados para cadastro'
            });
            return;
        }
        const user = yield Condominium.findOne({ email: email });
        if (user) {
            console.log("Usuário já foi cadastrado");
            res.status(401).json({
                'msg': 'Usuário já está cadastrado!'
            });
            return;
        }
        if (password !== confirmPassword) {
            console.log("Senha não confere");
            res.status(401).json({
                'msg': 'Suas senhas não confere, tente novamente'
            });
            return;
        }
        next();
    });
}
function verifyDataUpdatePassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { oldPassword, password, confirmPassword, id } = req.body;
        if (oldPassword || password || confirmPassword) {
            if (!oldPassword) {
                res.status(401).json({
                    'msg': 'Você precisa enviar sua SENHA ATUAL para criar uma nova'
                });
                return;
            }
            if (!password || !confirmPassword) {
                res.status(401).json({
                    'msg': 'Você precisa enviar sua SENHA NOVA e a CONFIRMAÇÃO'
                });
                return;
            }
            if (password !== confirmPassword) {
                res.status(401).json({
                    'msg': 'A NOVA SENHA e a CONFIRMAÇÃO não são iguais'
                });
                return;
            }
            try {
                const user = yield Condominium.findOne({ _id: id });
                console.log(user);
                const verifyPasswordUser = yield bcrypt.compare(oldPassword, user.password);
                if (verifyPasswordUser) {
                    const hashNewPassword = yield bcrypt.hash(password, 10);
                    req.body.newPasswordUpdate = hashNewPassword;
                    console.log(`senha nova : ${hashNewPassword}`);
                    next();
                    return;
                }
                else {
                    req.body.newPasswordUpdate = false;
                    res.status(401).json({
                        'msg': 'Senha atual invalida'
                    });
                    return;
                }
            }
            catch (error) {
                console.log(error);
                res.status(401).json({
                    'msg': 'Não foi possivel validar sua identidade, tente novamente ou procure o suporte'
                });
            }
        }
        if (!oldPassword && !password && !confirmPassword) {
            next();
        }
    });
}
module.exports = auth;
