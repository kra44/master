const mongoose = require("mongoose");

const statisquesSchema = new mongoose.Schema({
	idHome:{
		 type:mongoose.Schema.Types.ObjectId,ref: "Homes",
		 required: true
	},
	idUser:{
		 type:mongoose.Schema.Types.ObjectId,ref: "Users",
		 required: true
	},
	
},{ timestamps: true })
module.exports=mongoose.model("Statistiques", statisquesSchema);
