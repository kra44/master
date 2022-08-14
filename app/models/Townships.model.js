const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
	townshipName:{
		type: String,
		required: true
	},
	idCity:{
		 type:mongoose.Schema.Types.ObjectId,ref: "Cities",
		 required: true
	}
},{ timestamps: true })
module.exports=mongoose.model("Townships", ownerSchema);