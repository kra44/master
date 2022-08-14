const adminModel = require("../models/Admin.model");
const homeModel = require("../models/homes.model");
const ownerModel = require('../models/Owner.model');
const connexionModel = require('../models/Connexion.model');
const homeTypeModel = require("../models/HomeType.model");
const userMailModel = require("../models/UserMail.model");
const userModel = require("../models/Users.model");

const bcrypt = require('bcrypt');
const  salt = bcrypt.genSaltSync(12);

//create Owner
exports.creatsAdmin = async (req, res)=>{
	if(!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.contact || !req.body.password){
    return res.status(200).send({message: "invalide content"})
}
 var validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if(!validEmail.test(req.body.email)){
  	return res.status(200).send({ message: "Invalide email "})
  }else if(req.body.password.length < 8){
  	return res.status(200).send({ message: "Password cant contente 8 characters" })
  }
  adminModel.findOne({email:req.body.email}).then(existAdmin=>{
  	if(existAdmin){
  		return res.status(200).send({ message:"Adresse email déjà utilser"})
  	}
  	bcrypt.hash(req.body.password, salt, function(err,passHash){
  	if(passHash){
  		const connexion = new connexionModel({
  			email: req.body.email,
  			password: passHash,
  			roles:"admin"
  		})
  		connexion.save().then(connectData=>{
  			if(!connectData){
  				return res.status({ message: "Une erreur s'est produite !"})
  			}
  			 const admin = new adminModel({
			  	  firstName: req.body.firstName,
			  	  lastName: req.body.lastName,
			  	  email: req.body.email,
			  	  contact: req.body.contact,
			  	  password: passHash
		  })
			  admin.save().then(saveData=>{
			  	if(!saveData){
			  		return res.status(200).send({ message: err.message})
			  	}
			  	res.send({ data: saveData, connect: connectData })
			  }).catch(err=>{
			  	return res.status(500).send({ message: err.message})
			  })
  		})
  		
  	}
  })
  }).catch(err=>{
  	return res.status({ message: err.message })
  })
}
  

// find owner profil
exports.getAdminProfil = (req, res) =>{
	if(!req.params.idAdmin){
		return res.status(200).send({ message: "Invalide Id"})
	}
	adminModel.findOne({_id: req.params.idAdmin}).then(adminData=>{
		if(!adminData){
			return res.status(200).send({ message: "cannot get information of this id "+req.params.idAdmin})
		}
		res.send({ data: adminData })
	})
}


// update owner profile
exports.updateAdmin = async (req, res)=>{
	if(!req.body.idAdmin){
    return res.status(200).send({message: "invalide idAdmin "})
}
	 var validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	  if(!validEmail.test(req.body.email)){
	  	return res.status(200).send({ message: "Adresse email invalide ! "})
	  	
	  }else if(req.body.password.length < 8){
	  	return res.status(200).send({ message: "Le mot de passe doit contenir au moins 8 charactères !" })
	  }
   adminModel.findOne({_id:req.body.idAdmin}).then(existUser=>{
   	if(!existUser){
   		return res.status(200).send({ message: "Utilisateur non trouvé"})
   	}
   	const passHash = existUser.password

   	bcrypt.compare(req.body.password,passHash).then(isMatch => {
	      if(!isMatch){
   			return res.status(200).send({ message: "Mot de passe incorrect !" })
   		  }
        	  adminModel.findByIdAndUpdate(existUser._id,{
		   		firstName: req.body.firstName? req.body.firstName : existUser.firstName,
		   		lastName: req.body.lastName? req.body.lastName : existUser.lastName,
		   		contact: req.body.lastName? req.body.contact : existUser.contact,
		   		email: req.body.email? req.body.email : existUser.email
		   	}).then(updateData=>{
		   		if(!updateData){
		   			return res.status(200).send({ message: "Erreur de mise à jour !"})
		   		}
		   		res.send({ data:updateData })
		   	}).catch(err=>{
		   		return res.status(500).send({ message: "Error from server"})
		   	})
      	})
   	  }).catch(err=>{
	    return res.status(500).send({ message: "Error from server1"})
  })
}


//all owner list
exports.allOwnerList =(req, res) =>{
  ownerModel.find().then(ownerData=>{
  	if(!ownerData){
  		return res.status(200).send({ message: "Cannot found data" })
  	}
  	return res.send({ data: ownerData })
  }).catch(err=>{
  	return res.status(500).send({ message: err.message || "Error from server" })
  })
}

//get owner detail
exports.getOwnerdetails = (req, res)=>{
	if(!req.params.idOwner){
  		return res.status(200).send({ message: "invalide owner id" })
	}
	ownerModel.findOne({_id:req.params.idOwner}).then(ownerData=>{
		if(!ownerData){
			return res.status(200).send({ message: "cannot found data from owner table"})
		}
		homeModel.find({idOwner: ownerData._id}).select("homeName").then(homeData=>{
			if(!homeData){
				return res.status(200).send({ message: "cannot found data from home table"})
			}
			const data = { ownerData: ownerData, homeData: homeData}
			res.send({ data })
		}).catch(err=>{
			return res.status(500).send({ message: err.message || "Error from server" })
		})
	}).catch(err=>{
		return res.status(500).send({ message: err.message || "Error from server" })
	})
}

//get all home of one user
exports.getAllOwnerHome =(req, res) =>{
	if(!req.params.idOwner){
		return res.status(200).send({ message: "Cannot found dara"})
	}
	homeModel.find({idOwner:req.params.idOwner}).then(homeData=>{
		if(!homeData){
			return res.status(200).send({ message: "cannot found data"})
		}
		res.send({dara: homeData})
	}).catch(err=>{
		return res.status(500).send({ message: err.message || "Error from server"})
	})
}

//home detail
exports.getHomedetails =(req, res) =>{
	if(!req.params.idHome){
		return res.status(200).send({ message: "Cannot found data"})
	}
	homeModel.find({_id:req.params.idHome}).then(homeData=>{
		if(!homeData){
			return res.status(200).send({ message: "cannot found data"})
		}
		res.send({dara: homeData})
	}).catch(err=>{
		return res.status(500).send({ message: err.message || "Error from server"})
	})
}

// Active owner
exports.activeOwner =(req, res) => {
	if(!req.params.idOwner){
		return res.status(200).send({message:"Identifiant non spécifier"})
	}
	ownerModel.findByIdAndUpdate(req.params.idOwner,{
		status: 1
	}).then(activeData =>{
		if(!activeData){
			return res.status(400).send({message: "Une erreur s'est produite !"})
		}
		res.send({ data: activeData })
	}).catch(err=>{
		return res.status(500).send({message: err.message || "Erreur from server !"})
	})
}

// Desactivé owner
exports.desactiveOwner =(req, res) => {
	if(!req.params.idOwner){
		return res.status(200).send({message:"Identifiant non spécifier"})
	}
	ownerModel.findByIdAndUpdate(req.params.idOwner,{
		status: 0
	}).then(desactiveData =>{
		if(!desactiveData){
			return res.status(400).send({message: "Une erreur s'est produite !"})
		}
		res.send({ data: desactiveData })
	}).catch(err=>{
		return res.status(500).send({message: err.message || "Erreur from server !"})
	})
}

// get one owner home liste
exports.ownerHomeList =(req, res) => {
	if(!req.params.idOwner){
		return res.status(200).send({message:"Identifiant non spécifier"})
	}
	homeModel.find({idOwner : req.params.idOwner })
	.populate({path:"idOwner"})
	.then(homeData =>{
		if(!homeData){
			return res.status(400).send({message: "Data not found !"})
		}
		res.send({ data: homeData })
	}).catch(err =>{
		return res.status(500).send({ message: err.message || "Error from server !"})
	})
}

// get all home
exports.getAllHome =(req, res) => {
	homeModel.find()
	.populate({path:"idTownship", populate:{path:"idCity"}})
	.populate({path:"idOwner"})
	.then(homeData => {
		if(!homeData){
			return res.status(400).send({ message: "Cannot found data !" })
		}
		res.send({ data: homeData })
	}).catch(err => {
		return res.status(500).send({ message: err.message || "Error from server !"})
	})
}

//get all message of all mach user
exports.getAllUserMessage =(req, res)=>{
     userMailModel.find().then(userMailData=>{
     	if(!userMailData){
     		return res.status(400).send({message:"Cannot found data"})
     	}
     	res.send({data: userMailData})
     }).catch(err=>{
     	return res.status(500).send({message:err.message || "Error from server !"})
     })
}

//get all usesrs list
exports.allUsersList =(req, res)=>{
	userModel.find().then(userData=>{
		if(!userData){
			return res.status(400).send({message: "Cannot found data from this table !"})
		}
		res.send({data : userData})
	}).catch(err=>{
		return res.status(500).send({message: err.message || "Errror from server !"})
	})
}
