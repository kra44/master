const mongoose = require("mongoose");

const homesSchema = new mongoose.Schema({
	homeName:{
		type: String,
		required: true
	},
	idHomeType:{
		 type:mongoose.Schema.Types.ObjectId,ref: "Hometypes",
	},
	idCity:{
		 type:mongoose.Schema.Types.ObjectId,ref: "Cities",
	},
	idTownship:{
		 type:mongoose.Schema.Types.ObjectId,ref: "Townships",
	},
	idOwner:{
		type: mongoose.Schema.Types.ObjectId,ref:"Owners"
	},
	numberItems:{
		type: Number,
		required: true
	},
	prix:{
		type: Number,
		required: true
	},
	homeImage:{
		type:[Object],
		required: false
	},
	avance:{
		type: Number,
		required: false
	},
	description:{
		type: String,
		required: false
	},
	cosson:{
		type: Number,
		required: false
	},
	video:{
		type: [Object],
		required: false
	},
	availablity:{
		type: String,
		required: true
	},
	otherHomeCondition:{
		type: String,
		required: false
	},
    otherCategory:{
    	type: String,
    	required: false
    },
    otherCity:{
    	type: String,
    	required: false
    },
    longitude:{
    	type: String,
    	required: true
    },
    latitude:{
    	type: String,
    	required: true
    },
    status:{
    	type: Boolean,
    	default: false
    },
    suplier:{
    	type:Boolean,
    	default: false
    }
},{ timestamps: true })
module.exports=mongoose.model("Homes", homesSchema);
