const citieModel = require("../models/cities.model");
const townshipModel = require("../models/Townships.model")

// ceate  new cite
exports.createNawCity =( req, res) => {
    if(!req.body.citieName){
    	return res.status(200).send({ message: "Invalide content" })
    }else if(req.body.citieName.length < 2 || isNaN(req.body.citieName) === false){
    	return res.status(200).send({ message: "Nom invalide" })
    }
    const city = new citieModel({
    	 citieName: req.body.citieName
    })
    city.save().then(ceateCityData =>{
    	if(!ceateCityData){
    		return res.status(200).send({ message: "Erreur lors de la creation"})
    	}
    	res.send({ data: ceateCityData })
    }).catch(err=>{
    	return res.status(500).send({ message: "Error from server" })
    })
}

//update city
exports.updateCity = (req, res) => {
	if(!req.body.idCity || !req.body.citieName){
		return res.status(200).send({ message: "Invalide contente"})
	}else if(req.body.citieName.length < 2 || isNaN(req.body.citieName) === false){
    	return res.status(200).send({ message: "Nom invalide" })
    }
	citieModel.findByIdAndUpdate(req.body.idCity,{
		citieName:req.body.citieName
	}).then(updateData=>{
		if(!updateData){
			return res.status(200).send({ message: "As error when updating "})
		}
		res.send({ data: updateData })
	}).catch(err=>{
		return res.status(500).send({ message: "Error from server" })
	})
}

exports.cityList = (req, res)=>{
	citieModel.find().then(cityData =>{
		if(!cityData){
			return res.status(200).send({ message: "Aucune donnée trouvé !" })
		}
		res.send({ data: cityData })
	}).catch(err=>{
		return res.status(500).send({ message: err.message })
	})
}

// ceate  new cite
exports.addTownship =( req, res) => {
    if(!req.body.idCity || !req.body.townshipName){
    	return res.status(200).send({ message: "Invalide content" })
    }else if(req.body.townshipName.length < 2 || isNaN(req.body.townshipName) === false){
    	return res.status(200).send({ message: "Nom invalide" })
    }
    const city = new townshipModel({
    	 idCity: req.body.idCity,
    	 townshipName: req.body.townshipName

    })
    city.save().then(ceateData =>{
    	if(!ceateData){
    		return res.status(200).send({ message: "Erreur lors de la creation"})
    	}
    	res.send({ data: ceateData })
    }).catch(err=>{
    	return res.status(500).send({ message: "Error from server" })
    })
}

//update townShip
exports.updateTownship = (req, res) => {
	if(!req.body.idTownship || !req.body.idCity || !req.body.townshipName){
		return res.status(200).send({ message: "Invalide contente"})
	}else if(req.body.townshipName.length < 2 || isNaN(req.body.townshipName) === false){
    	return res.status(200).send({ message: "Nom invalide" })
    }
	townshipModel.findByIdAndUpdate(req.body.idTownship,{
		townshipName:req.body.townshipName,
		idCity: req.body.idCity
	}).then(updateData=>{
		if(!updateData){
			return res.status(200).send({ message: "As error when updating "})
		}
		res.send({ data: updateData })
	}).catch(err=>{
		return res.status(500).send({ message: "Error from server" })
	})
}

// township list
exports.getTownshipList =(req, res) => {
	if(!req.params.idCity){
		return res.status(200).send({ message: "Data not found" })
	}
	townshipModel.find({ idCity: req.params.idCity })
     .populate({path:"idCity"})
	.then(twonshipData=>{
		if(!twonshipData){
			return res.status(400).send({ message: "Data not found" })
		}
		res.send({ data: twonshipData })
	}).catch(err=>{
		return res.status(500).send({ message : err.message })
	})
}

// all township
exports.getAllTownship =(req, res) => {
	townshipModel.find()
     	.then(twonshipData=>{
		if(!twonshipData){
			return res.status(400).send({ message: "Data not found" })
		}
		res.send({ data: twonshipData })
	}).catch(err=>{
		return res.status(500).send({ message : err.message })
	})
}

// get all city and township
exports.getAllCityAndTownship =(req, res)=>{
 
    townshipModel.find()
	.populate({path:"idCity"})
	.then(homeData =>{
		if(!homeData){
			return res.status(500).send({ message: "Cannot found data of this idHomeType" })
		}
		console.log(homeData)
		res.send({ data: homeData })
	}).catch(err=>{
		return res.status(500).send({ message: "Error from server !"})
	})
}

