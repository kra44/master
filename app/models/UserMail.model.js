const mongoose = require("mongoose");

const userMailSchema = new mongoose.Schema({
	userId:{
		type: String,
		required: true
	},
	email:{
		type: String,
		required: true
	},
	phone:{
		type: String,
		required: true
	},
	message:{
		type: String
	},
	role:{
		type: String,
		required: true
	},
	answer:{
		type: String,
		required: false
	},
	adminId:{
		type: String,
		required: false
	}
},{ timestamps: true })
module.exports=mongoose.model("UserMails", userMailSchema);