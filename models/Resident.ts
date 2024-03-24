import mongoose, {Schema,model} from "mongoose";


const SchemaResident =  new Schema({
    id_condominium: {
        type: mongoose.Types.ObjectId,
        ref:"Condominium",
        required: true
    },
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    }
})

 const Resident = model('Resident',SchemaResident)

module.exports = Resident