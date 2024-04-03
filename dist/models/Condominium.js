"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SchemaCondominium = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    status: Boolean,
    size_limit: Number,
    size: Number
});
const Condominium = (0, mongoose_1.model)('Condominium', SchemaCondominium);
module.exports = Condominium;
