'use strict';

const homeModel = require('../models/homes.model');
const homeTypeModel = require("../models/HomeType.model");
const statisqueModel = require("../models/statistique.model")

//create new home type
exports.createNewHomeType = (req, res) =>{
	if(!req.body.homeTypeName){
		return res.status(200).send({ message: "Invalide content" })
	}
	const homeType = new homeTypeModel({
		homeTypeName: req.body.homeTypeName
	})
	homeType.save().then(createData=>{
		if(!createData){
			return res.status(200).send({ message: "As error when create this home typt" })
		}
		 res.send({ data: createData })
	}).catch(err=>{
		return res.status(500).send({ message: "Error from server" })
	})
}

//update home type
exports.updateHometype = (req, res) => {
	if(!req.body.idHomeType || !req.body.homeTypeName){
		return res.status(200).send({ message: "Invalide contente"})
	}
	homeTypeModel.findByIdAndUpdate(req.body.idHomeType,{
		homeTypeName:req.body.homeTypeName
	}).then(updateData=>{
		if(!updateData){
			return res.status(200).send({ message: "As error when updating "})
		}
		res.send({ data: updateData })
	}).catch(err=>{
		return res.status(500).send({ message: "Error from server" })
	})
}

// add new home
exports.addNewHome = (req, res) =>{
  console.log(req.body)
	if(!req.body.idOwner || !req.body.idCity || !req.body.idHomeType  || !req.body.numberItems || !req.body.prix || !req.body.residenceName){
		return res.status(400).send({ message: "Invalide content" })
	}
      const fileSizeFormatter = (bytes, decimal) => {
        if(bytes === 0){
                return '0 Bytes';
            }
            const dm = decimal || 2;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];
            const index = Math.floor(Math.log(bytes) / Math.log(1000));
            return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];

        }


     let filesArray =[];
     req.files.forEach(element=>{
     	const file ={
               fileName: element.originalname,
                filePath: element.path,
                fileType: element.mimetype,
                fileSize: fileSizeFormatter(element.size, 2)
     	   }

              filesArray.push(file);
     })
     

    const home = new homeModel({
    	homeName: req.body.residenceName,
    	idHomeType: req.body.idHomeType,
    	idOwner: req.body.idOwner,
    	idCity: req.body.idCity,
    	prix: parseInt(req.body.prix),
    	numberItems: parseInt(req.body.numberItems),
    	description: req.body.description,
    	cosson:req.body.cosson ? parseInt(req.body.cosson):0,
    	avance: req.body.avance ? parseInt(req.body.avance):0,
    	availablity: req.body.vente? req.body.vente : req.body.location? req.body.location: req.body.locationVente? req.body.locationVente:'',
    	idTownship: req.body.idTownship,
    	otherHomeCondition: req.body.otherHomeCondition,
    	otherCity: req.body.otherCity,
    	otherCategory: req.body.otherCategory,
    	longitude: req.body.lng,
    	latitude: req.body.lat,
    	homeImage: filesArray
    })
    home.save().then(createData=>{
    	if(!createData){
    		return res.status({ message: err.message || "As error occurred when create this home" }) 
    	}
    	res.send({ data: createData })
    }).catch(err=>{
    	return res.status(500).send({ message: err.message || "Error from server 02" })
    })
}

//add video
// add new home
exports.addHomeVideo = (req, res) =>{
 
	if(!req.body.idHome){
		return res.status(200).send({ message: "Invalide content" })
	}
      const fileSizeFormatter = (bytes, decimal) => {
        if(bytes === 0){
                return '0 Bytes';
            }
            const dm = decimal || 2;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];
            const index = Math.floor(Math.log(bytes) / Math.log(1000));
            return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];

        }
     let filesArray =[];
     req.files.forEach(element=>{
     	const file ={
               fileName: element.originalname,
                filePath: element.path,
                fileType: element.mimetype,
                fileSize: fileSizeFormatter(element.size, 2)
     	   }

              filesArray.push(file);
     })
 console.log(filesArray)
    homeModel.findByIdAndUpdate(req.body.idHome,{
    	video: filesArray
    }).then(videoData=>{
    	if(!videoData){
    		return res.status({ message: "As error occurred when create this home" }) 
    	}
    	res.send({ data: videoData })
    }).catch(err=>{
    	return res.status(500).send({ message: "Error from server 02" })
    })
}

// update owner profile
exports.updateHome = async (req, res)=>{
	if(!req.body.idHome){
    return res.status(200).send({message: "invalide id"})

   }else if(req.body.homeName.length < 8){
	  	return res.status(200).send({ message: "Password cant contente 8 characters" })

	}else if(isNaN(req.body.numberItems) ===true || isNaN(req.body.prix) ===true){
		return res.status(200).send({ message:"Erreur, la quantité doit être un entier" })
	}
   homeModel.findOne({_id:req.body.idHome}).then(existUser=>{
   	if(!existUser){
   		return res.status(200).send({ message: "home not found"})
   	}
    	  homeModel.findByIdAndUpdate(existUser._id,{
	   		homeName: req.body.homeName? req.body.homeName : existUser.homeName,
	   		idHomeType: req.body.idHomeType? req.body.idHomeType : existUser.idHomeType,
	   		idCity: req.body.idCity? req.body.idCity : existUser.idCity,
	   		quartier: req.body.quartier,
	    	prix: req.body.prix? req.body.prix : existUser.prix,
	    	numberItems: req.body.numberItems? req.body.numberItems : existUser.numberItems
	   	}).then(updateData=>{
	   		if(!updateData){
	   			return res.status(200).send({ message: "Error occurrent updating user"})
	   		}
	   		res.send({ data:updateData })
	   	}).catch(err=>{
	   		return res.status(500).send({ message: "Error from server0"})
	   	})
      	
   	  }).catch(err=>{
	    return res.status(500).send({ message: "Error from server1"})
  })
}


//get home by id
exports.getHomeById =(req, res) =>{
	if(!req.params.idHome){
        return res.status(200).send({ message: "Invalide id"})
	}
	homeModel.findOne({_id: req.params.idHome}).then(homeData=>{
		if(!homeData){
			return res.status(200).send({ message:"cannot found data from this id"})
		}
		res.send({ data: homeData })
	}).catch(err=>{
		return res.status(500).send({message:"Error from server"})
	})
}

//Get all owner home
exports.getAllOwnerHome = (req, res)=>{
	if(!req.params.idOwner){
         return res.status(200).send({ message: "Invalide id"})
	}
	homeModel.find({ idOwner: req.params.idOwner, status: false }).then(allData =>{
		if(!allData){
			return res.status(200).send({ message: "cannot found data from this table"})
		}
		res.send({ data: allData })
	}).catch(err=>{
		return res.status(500).send({ message:"Error from server" })
	})
}

//get statique data
//Get all owner home
exports.getStatisticalData = (req, res)=>{
	if(!req.params.idOwner){
         return res.status(200).send({ message: "Invalide id"})
	}
	statisqueModel.find({ idOwner: req.params.idOwner, status: true }).then(allData =>{
		if(!allData){
			return res.status(200).send({ message: "cannot found data from this table"})
		}
		res.send({ data: allData })
	}).catch(err=>{
		return res.status(500).send({ message:"Error from server" })
	})
}


exports.getOneOwnerHome =(req, res) => {
	console.log(req.params)
	if(!req.params.idHome){
		return res.status(200).send({ message: "Invalide params id"})
	}
	homeModel.findOne({_id: req.params.idHome})
	.populate({path:'idOwner'})
	.then(homeData => {
		if(!homeData){
			return res.status(400).send({ message: "data not found"})
		}
		res.send({ data: homeData })
	}).catch(err=>{
		return res.status(500).send({ message: err.message || "Error from server" })
	})
}


//Get all  homes
/*exports.getAllOwnerHome = (req, res)=>{
	console.log("enter")
	 // res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	homeModel.find().then(allData =>{
		if(!allData){
			return res.status(200).send({ message: "cannot found data from this table"})
		}
		   //  	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    	// res.setHeader('Cross-Origin-Embedder-Policy','require-corp');
    	// res.setHeader('Cross-Origin-Opener-Policy', '*'); 
    	// res.setHeader('Cross-Origin-Resource-Policy', 'http://localhost:3001');
    	// res.setHeader('X-DNS-Prefetch-Control', 'on');
		res.send({ data: allData })
	}).catch(err=>{
		return res.status(500).send({ message:"Error from server" })
	})
}*/

// get home available
exports.getHomeAvailable =(req, res) => {
	if(!req.params.idOwner){
		return res.status(200).send({message:"invalide idOwner"})
	}
	homeModel.find({numberItems:{$gt:0}, idOwner: req.params.idOwner }).then(homeData=>{
		if(!homeData){
			return res.status(200).send({ message:"cannot found data for this requet"})
		}
		res.send({ data: homeData })
	}).catch(err=>{
		return res.status(500).send({ message:"Error from server" })
	})
}

//get all home not available
exports.getAllHomeNotAvailable =(req, res) => {
	if(!req.params.idOwner){
		return res.status(200).send({message:"invalide idOwner"})
	}
	homeModel.find({ numberItems:{$lte:2}, idOwner: req.params.idOwner }).then(homeData=>{
		if(!homeData){
			return res.status(200).send({ message:"Data not found"})
		}
		res.send({data: homeData} )
	}).catch(err=>{
		return res.status(500).send({ message:"Error from server"})
	})
}

//decrease home item number
exports.decreaseHomeItem =(req, res)=>{
	if(!req.body.idHome || !req.body.newHomeItemNumber){
		return res.status(200).send({ message:"Invalide contente" })
	}

	if(isNaN(req.body.newHomeItemNumber) ===true){
		return res.status(200).send({ message:"Erreur, la quantité doit être un entier" })
	}
	homeModel.findOne({ _id: req.body.idHome }).then(homeData=>{
		if(!homeData){
			return res.status(200).send({ message:"cannot found data" })
		}
		if(homeData.numberItems === 1){
			return res.status(200).send({ message:"Opération impossible" })
		}
		const newHomeItem = homeData.numberItems - req.body.newHomeItemNumber;

		if(!newHomeItem){
			return res.status(200).send({ message: "Une erreur s'est produites" })
		}
	homeModel.findByIdAndUpdate(homeData._id,{
		numberItems: newHomeItem
	}).then(newHomeData=>{
		if(!newHomeData){
			return res.status(200).send({ message:"Une erreur s'est produite" })
		}
		res.send({ data: homeData })
	}).catch(err=>{
		return res.status(500).send({ message: "Error from server" })
	})
	}).catch(err=>{
		return res.status(500).send({ message: "Error from server" })
	})
}

//Increase home item number
exports.increaseHomeItem =(req, res)=>{
	if(!req.body.idHome || !req.body.newHomeItemNumber){
		return res.status(200).send({ message:"Invalide contente" })
	}

	if(isNaN(req.body.newHomeItemNumber) ===true){
		return res.status(200).send({ message:"Erreur, la quantité doit être un entier" })
	}
	homeModel.findOne({ _id: req.body.idHome }).then(homeData=>{
		if(!homeData){
			return res.status(200).send({ message:"cannot found data" })
		}
		if(homeData.numberItems === 1){
			return res.status(200).send({ message:"Opération impossible" })
		}
		const newHomeItem = homeData.numberItems + req.body.newHomeItemNumber;

		if(!newHomeItem){
			return res.status(200).send({ message: "Une erreur s'est produites" })
		}
	homeModel.findByIdAndUpdate(homeData._id,{
		numberItems: newHomeItem
	}).then(newHomeData=>{
		if(!newHomeData){
			return res.status(200).send({ message:"Une erreur s'est produite" })
		}
		res.send({ data: homeData })
	}).catch(err=>{
		return res.status(500).send({ message: "Error from server" })
	})
	}).catch(err=>{
		return res.status(500).send({ message: "Error from server" })
	})
}

exports.getHistorique = (req, res) => {
	homeModel.find()
	
	.then(homeData=>{
		if(!homeData){
			return res.status(200).send({ message:"cannot found data !"})
		}
		res.send({ data: homeData })
	}).catch(err=>{
		return res.status(500).send({ message : "Error from server !"})
	})
}

//get all home type
exports.getAllHomeType =(req, res)=>{
	homeTypeModel.find().then(homeData=>{
		if(!homeData){
			return res.status(400).send({ message: "Cannot found data "})
		}
		res.send({ data: homeData })
	}).catch(err=>{
		return res.status(500).send({ message: err.message })
	})
}

//get all home has busy (statistique)
exports.allHomeHareBusy = (req, res) =>{
	homeModel.find({status:true})
	.populate({path:"idOwner"})
	.then(statistiqueData =>{
		console.log(statistiqueData)
		if(!statistiqueData){
			return res.status(200).send({message: "Data not found !"})
		}
		res.send({ data : statistiqueData })
	}).catch(err => {
		return res.status(500).send({ message: err.message || "Error from server !"})
	})
}

// get  home is suplier
exports.getSuplierHome = (req, res) =>{
	homeModel.find({suplier:true}).then(suplierData => {
		if(!suplierData){
			return res.status(200).send({ message: "Data not found !"})
		}
		res.send({ data : suplierData})
	}).catch(err =>{
		return res.status(500).send({ message: err.message || "Error from server !"})
	})
}

// validate house
exports.validateHouse = (req, res) =>{
	if(!req.body.idHome || req.body.idOwner){
		return res.status(200).send({ message: "invalide id !"})
	}
	homeModel.findByIdAndUpdate(req.params.idHome, { suplier:false, status: true }).then(suplierData => {
		if(!suplierData){
			return res.status(200).send({ message: "Data not found !"})
		}

		const statistcal = new statisqueModel({
			idHome: req.body.idHome,
			idOwner: req.body.idOwner
		})
		res.send({ data : suplierData})
	}).catch(err =>{
		return res.status(500).send({ message: err.message || "Error from server !"})
	})
}


// Mise en attente la maison
exports.updtatHouse = (req, res) =>{
		if(!req.body.idHome || !req.body.idUser){
		return res.status(200).send({ message: "invalide id !"})
	}
	homeModel.findByIdAndUpdate(req.body.idHome, { suplier:true }).then(suplierData => {

		if(!suplierData){
			return res.status(200).send({ message: "Data not found !"})
		}

		const statistique = new statisqueModel({
			idHome: req.body.idHome,
			idUser: req.body.idUser
		})
		.save().then(statistiqueData =>{
			if(!statistiqueData){
				return res.status(200).send({ message: "Data not found !"})
			}
			res.send({ data : statistiqueData})
		})
	}).catch(err =>{
		return res.status(500).send({ message: err.message || "Error from server !"})
	})
}

//get Residence
exports.getResidence =(req, res) =>{
	const homTypeIdArray =[]
	homeTypeModel.find({homeTypeName:"Residence"}).select("_id")
	.then(async homeTypeData =>{
		Promise.all(homeTypeData.map(h => {
             homTypeIdArray.push(h._id)
		}));
      
		await homeModel.find({idHomeType: {$in:homTypeIdArray}})
		.populate({path:"idTownship", populate:{path:"idCity"}})
		.then(residenceData =>{
			if(!residenceData){
				return res.status(400).send({message: "Cannot found data !"})
			}
			console.log(residenceData)
			res.send({data : residenceData })
		}).catch(err =>{
			return res.status(500).send({message: err.message || "Error from server"})
		})
	}).catch(err=>{
		return res.status(500).send({message: err.message || "Error from server !"})
	})
}




