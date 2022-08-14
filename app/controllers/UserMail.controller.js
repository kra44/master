const userMailModel = require("../models/UserMail.model");

//save user's message
exports.createMessage =(req, res)=>{
	if(!req.body.email || !req.body.phone || !req.body.role || !req.body.userId || !req.body.message){
		return res.status(200).send({ message: "Invalide contente" })
	}
	const userMail = new userMailModel({
		userId: req.body.userId,
		email: req.body.email,
		phone: req.body.phone,
		role: req.body.role,
		message: req.body.message
	})
	userMail.save().then(data=>{
       if(!data){
       	return res.status(400).send({message: "Une erruer s'est produite lors de l'enregistrement"})
       }
       res.send(data)
	}).catch(err =>{
		return res.status(500).send({message:err.message || "Error from server"})
	})
}

//get all message 
exports.getAllMessage =(req, res)=>{
	userMailModel.find().then(mailData=>{
		if(!mailData){
			return res.status(400).send({message: "Data not found !"})
		}
		return res.send({data: mailData})
	}).catch(err=>{
		return res.status(500).send({message:err.message || "Error from server !"})
	})
}

//user mils anser
exports.userMailsAnser = (req, res)=>{
	console.log(req.body)
   if(!req.body.answer || !req.body.idAdmin || !req.body.messageId){
       return res.status(200).send({message: "Invalide content !"})
   }
   userMailModel.findByIdAndUpdate(req.body.messageId, {
   	answer: req.body.answer,
   	idAdmin: req.body.idAdmin
   }).then(messageData=>{
   	if(!messageData){
   		return res.status(400).send({message:"Cannot found data for this messageId "+req.body.messageId})
   	}
   	res.send({data : messageData })
   }).catch(err=>{
   	return res.status(500).send({ message: err.message || "Error from server !"})
   })
}