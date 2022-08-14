const ownerModel = require("../models/Owner.model");
const homeModel = require("../models/homes.model")
const connexionModel = require('../models/Connexion.model');

const bcrypt = require('bcrypt');
const  salt = bcrypt.genSaltSync(12);

//create Owner
exports.creatsOwner = async (req, res)=>{
	if(!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.contact || !req.body.password){
    return res.status(200).send({message: "invalide content"})
}
 var validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if(!validEmail.test(req.body.email)){
  	return res.status(200).send({ message: "Ivalide email "})
  }else if(req.body.password.length < 8){
  	return res.status(200).send({ message: "Password cant contente 8 characters" })
  }
  bcrypt.hash(req.body.password, salt, function(err,passHash){
  	if(passHash){
  		 const owner = new ownerModel({
			  	  firstName: req.body.firstName,
			  	  lastName: req.body.lastName,
			  	  email: req.body.email,
			  	  contact: req.body.contact,
			  	  password: passHash
  })
	  owner.save().then(saveData=>{
	  	if(!saveData){
	  		return res.status(200).send({ message: "Cannot create this owner"})
	  	}
	  	const connexion = new connexionModel({
	  		email: req.body.email,
	  		password: passHash,
	  		roles: "owner"
	  	})
	  	connexion.save().then(connecData=>{
	  		if(!connecData){
	  			return res.status(200).send({ message:"Une erreur s'est produit lors de l'inscription !"})
	  		}
	  		res.send({ data: saveData, connect: connecData })
	  	}).catch(err=>{
	  		return res.status(500).send({ message: err.message })
	  	})
	  	
	  }).catch(err=>{
	  	return res.status(500).send({ message: "Error from server"})
	  })
  	}
  })
 
}


// find owner profil
exports.getOwnerProfil = (req, res) =>{
	if(!req.params.idOwner){
		return res.status(200).send({ message: "Invalide Id"})
	}
	ownerModel.findOne({_id: req.params.idOwner}).then(ownerData=>{
		if(!ownerData){
			return res.status(200).send({ message: "cannot get information of this id "+req.params.idOwner})
		}
		res.send({ data: ownerData })
	})
}


// update owner profile
exports.updateOwnerProfil = async (req, res)=>{
	if(!req.body.idOwner){
    return res.status(200).send({message: "invalide id"})
}
	 var validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	  if(!validEmail.test(req.body.email)){
	  	return res.status(200).send({ message: "Ivalide email "})
	  	
	  }else if(req.body.password.length < 8){
	  	return res.status(200).send({ message: "Password cant contente 8 characters" })
	  }
   ownerModel.findOne({_id:req.body.idOwner}).then(existUser=>{
   	if(!existUser){
   		return res.status(200).send({ message: "User not found"})
   	}
   	const passHash = existUser.password

   	bcrypt.compare(req.body.password,passHash).then(isMatch => {
   		if(!isMatch){
	   			return res.status(200).send({ message: "Mot de passe incorrect !"})
	   		}
        	  ownerModel.findByIdAndUpdate(existUser._id,{
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

//get all owner list
exports.getAllOwner =(req, res) =>{
	ownerModel.find().then(ownerData=>{
		if(!ownerData){
			return res.status(400).send({ message: "Cannot found data "})
		}
		res.send({ data: ownerData })
	}).catch(err=>{
		return res.status(500).send({ message: "Error from server !"})
	})
}

//remoove owner home
exports.remoovesHome =(req, res) => {
	if(!req.params.idHome){
		return res.status(400).send({ message:"Invalide id !"})
	}
		homeModel.deleteOne({_id: req.params.idHome}).then(response =>{
			if(!response){
				return res.status(200).send({message:"Erreur de suppression !"})
			}
			return res.send({data : response})
		}).catch(err=>{
			return res.status(500).send({ message: err.message || "Error from server"})
		})
}

