const connexionModel = require('../models/Connexion.model');
const adminModel = require("../models/Admin.model");
const userModel = require("../models/Users.model")
const ownerModel = require("../models/Owner.model");

const bcrypt = require('bcrypt');
const  salt = bcrypt.genSaltSync(12);

exports.loginUser =(req, res) =>{
	if(!req.body.password || !req.body.email){
		return res.status(200).send({ message: "Invalide contente !" })
	}
	var validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if(!validEmail.test(req.body.email)){
  	return res.status(200).send({ message: "Invalide email "})

  }else if(req.body.password.length < 8){
  	return res.status(200).send({ message: "Le mot de passe doit contenir au moins 8 carractères !" })
  }

	connexionModel.findOne({"email": req.body.email}).then(loginData =>{
		if(!loginData){
			return res.status(200).send({ message:"Adresse email non trouver !"})
		}
		 	bcrypt.compare(req.body.password,loginData.password, function(err, isMatch) {
        	   if(isMatch){

        	   	  if(loginData.roles =="owner"){
	        	   	  	ownerModel.findOne({email: req.body.email}).then(ownerData=>{
	        	   		if(!ownerData){
	        	   			return res.status(200).send({ message: "Une erreur s'est produite lors de la connexion !"})
	        	   		}
	        	   		res.send({ data:ownerData, connect: loginData })
        	  	 	}).catch(err=>{
        	  	 		return res.status(500).send({ message: err.message })
        	  	 	})
        	   
        	   	  }else if(loginData.roles =="admin"){
                     adminModel.findOne({email: req.body.email}).then(adminData=>{
                     	if(!adminData){
                     		return res.status(200).send({ message: "Une erreur s'est produite lors de la connexion !"})
                     	}
                     	res.send({ data: adminData, connect: loginData })
                     }).catch(err=>{
        	  	 		return res.status(500).send({ message: err.message })
        	  	 	})


        	   	  }else if(loginData.roles =="user"){
                     userModel.findOne({ email: req.body.email }).then(userData=>{
                     	if(!userData){
                     		return res.status(200).send({ message: "Une erreur s'est produite lors de la connexion !"})
                     	}
                     	res.send({ data: userData, connect: loginData })
                     }).catch(err=>{
        	  	 		return res.status(500).send({ message: err.message })
        	  	 	})
        	   	  }
        	   	
        	   }else{
        	   	return res.status(200).send({ message: "Mot de passe incorrect !" })
        	   }
      	})
	}).catch(err =>{
		return res.status(500).send({ message: "Error from server" })
	})
}
