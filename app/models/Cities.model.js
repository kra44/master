const mongoose = require("mongoose");

const citiesSchema = new mongoose.Schema({
	citieName:{
		type: String,
		required: true
	}
},{ timestamps: true })
module.exports=mongoose.model("Cities", citiesSchema)