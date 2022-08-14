const mongoose = require("mongoose")
const roleSchema = new mongoose.Schema({
	email:{
		type: String,
		required: true
	},
	fullName:{
		type: String,
		required: true
	},
	phone:{
		type: String,
		required: true
	},
	message:{
		type: String,
		required: true
	}
},{timestamp: true})
module.exports=mongoose.model("Contacts", roleSchema);