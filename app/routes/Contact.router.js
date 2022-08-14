module.exports  =(app)=>{
	const _contact = require("../controllers/Contact.controller");

	app.post("/contactAdmin", _contact.contactAdmins);
}