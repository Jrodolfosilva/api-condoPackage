import {Schema,model} from "mongoose";


const SchemaCondominium = new Schema({
name: {
    type: String,
    required:true
},
phone: {
    type: String,
    required:true
},
email: {
    type: String,
    required:true
},
password:  {
    type: String,
    required:true
},
address:{
    type: String,
    required:true
}
,
status:Boolean,
size_limit: Number,
size: Number
})

const Condominium = model('Condominium',SchemaCondominium)




module.exports = Condominium