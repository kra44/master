const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
	firstName:{
		type: String,
		required: true
	},
	lastName:{
		type: String,
		required: true,
	},
	email:{
		type: String,
		required: true,
	},
	contact:{
		type: String,
		required: true
	},
	password:{
		type: String,
		required: true
	},
	status:{
		type: Number,
		required: true,
		default: 0
	}
},{ timestamps: true })
module.exports=mongoose.model("Owners", ownerSchema);