const contactModel = require("../models/Contact.model");

//send message
exports.contactAdmins =(req, res) =>{
	if(!req.body.phone || !req.body.email || !req.body.message){
		return res.status(200).send({message:"Invalid content"})
	}
	const contact = new contactModel({
		fullName: req.body.fullName,
		phone: req.body.phone,
		email: req.body.email,
		message: req.body.message
	}).save().then(contactData =>{
		if(!contactData){
			return res.status(200).send({message: "Une erruer s'est produite !"})
		}
		res.send({ data: contactData })
	}).catch(err =>{
		return res.status(500).send({ message: err.message || "Error from server"})
	})
}