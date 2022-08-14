const userModel = require("../models/Users.model")
const connexionModel = require('../models/Connexion.model');
const statisqueModel = require("../models/statistique.model");

const bcrypt = require('bcrypt');
const  salt = bcrypt.genSaltSync(12);


//create user
exports.createUsers =(req, res) =>{
	if(!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.contact || !req.body.password){
    return res.status(200).send({message: "invalide content"})
}
 var validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if(!validEmail.test(req.body.email)){
  	return res.status(200).send({ message: "Ivalide email "})

  }else if(req.body.password.length < 8){
  	return res.status(200).send({ message: "Password cant contente 8 characters" })

  }else if(req.body.lastName.length < 3 || req.body.firstName.length < 3 || isNaN(req.body.lastName) === false || isNaN(req.body.firstName) === false ){
    	return res.status(200).send({ message: "Nom invalide" })
    }
			  userModel.findOne({ email: req.body.email }).then(existUser=>{
			  	if(existUser){
			  		return res.status(200).send({ message: "Adresse mail déjà utiliser" })
			  	}
			  	bcrypt.hash(req.body.password, salt, function(err,passHash){
			  	if(passHash){
			  		const connexion = new connexionModel({
				  		email: req.body.email,
				  		password: passHash,
				  		roles: "user"
				  	})
				  	connexion.save().then(connectData=>{
				  		if(!connectData){
				  			return res.status(200).send({ message: "Une erreur s'est produite "})
				  		}
						  	 const user = new userModel({
						  	 	    idConnexion: connectData._id,
								  	  firstName: req.body.firstName,
								  	  lastName: req.body.lastName,
								  	  email: req.body.email,
								  	  contact: req.body.contact
					    })
								  user.save().then(saveData=>{
								  	if(!saveData){
								  		return res.status(200).send({ message: "Une errur s'est produite lors de la creation"})
								  	}
	  	
			  		res.send({ data: saveData, connect: connectData })
			  	}).catch(err=>{
			  		return res.status(500).send({ message: err.message })
			  	})
	  	
	  }).catch(err=>{
	  	return res.status(500).send({ message: "Error from server"})
	  })
  	}
  })
	})
}


// find user profil
exports.getUserProfil = (req, res) =>{
	if(!req.params.idUser){
		return res.status(200).send({ message: "Invalide Id"})
	}
	userModel.findOne({_id: req.params.idUser}).then(userData=>{
		if(!userData){
			return res.status(200).send({ message: "cannot get information of this id "+req.params.idUser})
		}
		res.send({ data: userData })
	})
}

// update user profile
exports.updateUser = async (req, res)=>{
	 var validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	  if(!validEmail.test(req.body.email)){
	  	return res.status(200).send({ message: "Ivalide email "})

	  }else if(req.body.password.length < 8){
	  	return res.status(200).send({ message: "Password cant contente 8 characters" })

	  }else if(req.body.lastName && isNaN(req.body.lastName) === false){
	  	return res.status(200).send({message:"format de nom incorrect"})

	  }else if(req.body.firstName && isNaN(req.body.firstName) === false){
	  	return res.status(200).send({message:"format de nom incorrect"})
	  }

   userModel.findOne({_id:req.body.idUser}).then(existUser=>{
   	if(!existUser){
   		return res.status(200).send({ message: "User not found"})
   	}
   	const passHash = existUser.password

   	bcrypt.compare(req.body.password,passHash).then(isMatch => {
        	  userModel.findByIdAndUpdate(existUser._id,{
		   		firstName: req.body.firstName? req.body.firstName : existUser.firstName,
		   		lastName: req.body.lastName? req.body.lastName : existUser.lastName,
		   		contact: req.body.lastName? req.body.contact : existUser.contact,
		   		email: req.body.email? req.body.email : existUser.email
		   	}).then(updateData=>{
		   		if(!updateData){
		   			return res.status(200).send({ message: "Error occurrent updating user"})
		   		}
		   		 return res.send({ data:updateData })
		   	}).catch(err=>{
		   		return res.status(500).send({ message: "Error from server0"})
		   	})
      	})
   	  }).catch(err=>{
		return res.status(500).send({ message: "Error from server1"})
  })
}


//find user home has choosing
exports.userHomeChoose =(req, res)=>{
	if(!req.params.idUser){
      return res.status(400).send({ message: "Invalide id"})
	}
	statisqueModel.find({idUser: req.params.idUser})
	.populate({path: "idHome"})
	.then(userHomeData =>{
		if(!userHomeData){
			return res.status(200).send({message: "cannot found data"})
		}
		res.send({ data: userHomeData })
	}).catch(err =>{
		return res.status(500).send({message: err.message || "Error from server !"})
	})

}

//update password
exports.changePassword =(req, res) =>{
	if(!req.body.idUser || !req.body.oldPassword || !req.body.newPassword || !req.body.confirmPassword){
		return res.status(400).send({message: "invalide content !"})
	}
	userModel.findOne({_id: req.body.idUser})
	.populate({path:"idConnexion"})
	.then(existUser =>{
		if(!existUser){
			return res.status(200).send({ message: "This user don't existe"})
		}
		bcrypt.compare(req.body.oldPassword, existUser.idConnexion.password, function(err, isMatch){
			if(!isMatch){
				return res.status(200).send({message: "mot de passe incorrect !"})
			}

			bcrypt.hash(req.body.newPassword, salt, function(err, passHash){
			if(!passHash){
				return res.status(200).send({ message: "Erreur de criptage !"})
			}
			connexionModel.findByIdAndUpdate(existUser.idConnexion._id,{
				password: passHash
			}).then(settingData =>{
				if(!settingData){
					return res.status(200).send({ message: "Une erreur s'est produite lors du criptage"})
				}
				res.send({ data: settingData })
			}).catch(err =>{
				return res.status(500).send({message: err.message || "Error from server !"})
			})
		})
		})
	
	}).catch(err =>{
				return res.status(500).send({message: err.message || "Error from server !"})
			})
}

//active and desactive user
exports.activeAndDesactiveUser =(req, res)=>{
	if(!req.body.userId){
      return res.status(200).send({message:"invalide contente"})
	}
	userModel.findByIdAndUpdate(req.body.userId,{
		status: req.body.newStatus
	}).then(userData=>{
		if(!userData){
			return res.status(200).send({message: "Erreur when updating this user "+req.body.userId})
		}
		res.send({ data : userData})
	}).catch(err=>{
		return res.status(500).send({ message: err.message || "Error from server !"})
	})
}

//user statistical
exports.userActions =(req, res)=>{
	if(!req.params.userId){
		return res.status(400).send({message:"Invalide params"})
	}
	statisqueModel.find({idUser:req.params.userId})
	.populate({path:"idUser"})
	.populate({path:"idHome"})
	.then(userData=>{
		if(!userData){
			return res.status(400).send({message:"Cannot found data from this id user"})
		}
		res.send({data: userData})
	}).catch(err=>{
		return res.status(500).send({message:err.message || "Error from server !"})
	})
}