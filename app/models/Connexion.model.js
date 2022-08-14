const mongoose = require("mongoose")
const roleSchema = new mongoose.Schema({
	email:{
		type: String,
		required: true
	},
	password:{
		type: String,
		required: true
	},
	roles:{
		type: String,
		required: true
	}
},{timestamp: true})
module.exports=mongoose.model("Connexions", roleSchema);