"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth = require('./routes/auth');
const resident = require('./routes/resident');
require('dotenv').config();
const app = (0, express_1.default)();
app.use('/auth', auth);
app.use('/resident', resident);
mongoose_1.default.connect(`mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS_DB}@login.ulxmouh.mongodb.net/`).then(() => {
    app.listen(3000, () => {
        console.log("Server on Fire👌: http://localhost:3000");
    });
}).catch((error) => console.log(error));
