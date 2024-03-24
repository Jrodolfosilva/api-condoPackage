import mongoose,{Schema,model} from "mongoose";


const SchemaPackage = new Schema({
id_resident:{
    type:mongoose.Types.ObjectId,
    ref:"Resident",
    required:true
},
name:{
    type:String,
    required: true
},
type:{
    type: String,
    required: true
},
chekin:{
    type: Date,
    required:true
},
checkout: {
    type: Date,
    required:true
},
code:{
    type: String,
    required: String
}
})


const Package = model('Package',SchemaPackage)

module.exports = Package