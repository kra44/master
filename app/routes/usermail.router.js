module.exports = (app) =>{
	const _user_mail = require("../controllers/UserMail.controller");

	app.post("/createUserMail", _user_mail.createMessage);
    app.get("/allUserMessage", _user_mail.getAllMessage);
    app.post("/userMailAnser", _user_mail.userMailsAnser)
} 