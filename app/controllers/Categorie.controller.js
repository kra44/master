const homeModel = require("../models/homes.model");
const citieModel = require("../models/cities.model");
const townshipModel = require("../models/Townships.model");
const homeTypeModel = require('../models/HomeType.model');

exports.findAllHomeOfCategorie = (req, res) =>{
	if(!req.params.idHomeType){
		return res.status(400).send({ message: "Invalide content" });
	}
	homeModel.find({idHomeType:req.params.idHomeType})
	.populate({path:"idTownship", populate:{path:"idCity"}})
	.then(homeData =>{
		console.log("testttt",homeData)
		if(!homeData){
			return res.status(500).send({ message: "Cannot found data of this idHomeType" })
		}
		res.send({ data: homeData })
	}).catch(err=>{
		return res.status(500).send({ message: "Error from server !"})
	})
}

//service one :  find all home numbre by name 02
exports.getCategoriesHomeOne = (req, res)=>{
  if(!req.params.homeTypeName){
  	return res.status(400).send({message: "invalide content"})
  }
  homeTypeModel.findOne({homeTypeName:req.params.homeTypeName}).then(homeTypeData=>{
      if(!homeTypeData){
      	return res.status(400).send({message: "cannot found data for the homeTypeName "+req.params.homeTypeName})
      }
      homeModel.find({idHomeType: homeTypeData._id}).then(homeData=>{
      	if(!homeData){
      		return res.status(400).send({message: err.message || "Cannot found data"})
      	}
      	
      	const dataSiez= homeData.length !== 0? homeData.length : 0
      	return res.send({data: dataSiez,idHomeType: homeTypeData._id})
      }).catch(err=>{
      	return res.status(500).send({message:err.message || "Error from server"})
      })
  }).catch(err=>{
  	return res.status(500).send({message: err.message || "Error from server !"})
  })
}

//service one :  find all home numbre by name 02
exports.getCategoriesHomeTow = (req, res)=>{
  if(!req.params.homeTypeName){
  	return res.status(400).send({message: "invalide content"})
  }
  homeTypeModel.findOne({homeTypeName:req.params.homeTypeName}).then(homeTypeData=>{
      if(!homeTypeData){
      	return res.status(400).send({message: "cannot found data for the homeTypeName "+req.params.homeTypeName})
      }
      homeModel.find({idHomeType: homeTypeData._id}).then(homeData=>{
      	if(!homeData){
      		return res.status(400).send({message: err.message || "Cannot found data"})
      	}
      	const dataSiez= homeData.length !== 0? homeData.length : 0
      	return res.send({data: dataSiez, idHomeType: homeTypeData._id})
      }).catch(err=>{
      	return res.status(500).send({message:err.message || "Error from server"})
      })
  }).catch(err=>{
  	return res.status(500).send({message: err.message || "Error from server !"})
  })
}

//service one :  find all home numbre by name 03
exports.getCategoriesHomeTree = (req, res)=>{
  if(!req.params.homeTypeName){
  	return res.status(400).send({message: "invalide content"})
  }
  homeTypeModel.findOne({homeTypeName:req.params.homeTypeName}).then(homeTypeData=>{
      if(!homeTypeData){
      	return res.status(400).send({message: "cannot found data for the homeTypeName "+req.params.homeTypeName})
      }
      homeModel.find({idHomeType: homeTypeData._id}).then(homeData=>{
      	if(!homeData){
      		return res.status(400).send({message: err.message || "Cannot found data"})
      	}
      const dataSiez= homeData.length !== 0? homeData.length : 0
      	return res.send({data: dataSiez, idHomeType: homeTypeData._id})
      }).catch(err=>{
      	return res.status(500).send({message:err.message || "Error from server"})
      })
  }).catch(err=>{
  	return res.status(500).send({message: err.message || "Error from server !"})
  })
}

//service one :  find all home numbre by name 04
exports.getCategoriesHomethourt = (req, res)=>{
  if(!req.params.homeTypeName){
  	return res.status(400).send({message: "invalide content"})
  }
  homeTypeModel.findOne({homeTypeName:req.params.homeTypeName}).then(homeTypeData=>{
      if(!homeTypeData){
      	return res.status(400).send({message: "cannot found data for the homeTypeName "+req.params.homeTypeName})
      }
      homeModel.find({idHomeType: homeTypeData._id}).then(homeData=>{
      	if(!homeData){
      		return res.status(400).send({message: err.message || "Cannot found data"})
      	}
      	const dataSiez= homeData.length !== 0? homeData.length : 0
      	return res.send({data: dataSiez, idHomeType: homeTypeData._id})
      }).catch(err=>{
      	return res.status(500).send({message:err.message || "Error from server"})
      })
  }).catch(err=>{
  	return res.status(500).send({message: err.message || "Error from server !"})
  })
}

//get all categorie Home by HomeType name
exports.getCategoriesHomeData = (req, res)=>{
  if(!req.params.homeTypeName){
  	return res.status(400).send({message: "invalide content"})
  }
  homeTypeModel.findOne({homeTypeName:req.params.homeTypeName}).then(homeTypeData=>{
      if(!homeTypeData){
      	return res.status(400).send({message: "cannot found data for the homeTypeName "+req.params.homeTypeName})
      }
      homeModel.find({idHomeType: homeTypeData._id}).then(homeData=>{
      	if(!homeData){
      		return res.status(400).send({message: err.message || "Cannot found data"})
      	}
      	return res.send({data: homeData})
      }).catch(err=>{
      	return res.status(500).send({message:err.message || "Error from server"})
      })
  }).catch(err=>{
  	return res.status(500).send({message: err.message || "Error from server !"})
  })
}
