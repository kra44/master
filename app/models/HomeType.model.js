const mongoose = require("mongoose");

const homeTypesSchema = new mongoose.Schema({
	homeTypeName:{
		type: String,
		required: true
	}
},{ timestamps: true })
module.exports=mongoose.model("HomeTypes", homeTypesSchema);

