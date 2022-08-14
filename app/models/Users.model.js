const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
	idConnexion:{
		type:mongoose.Schema.Types.ObjectId,ref:"Connexions",
		required: true
	},
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
	status:{
		type: Number,
		required: true,
		default: 1
	}
	
},{ timestamps: true })
module.exports=mongoose.model("Users", usersSchema);