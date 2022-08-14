module.exports = (app) => {
	const  _user = require("../controllers/Users.controller");

	app.post("/createUsers", _user.createUsers);
	app.get("/getUserById/:idUser", _user.getUserProfil);
	app.put("/updateUser", _user.updateUser);
	app.get("/userHomelist/:idUser", _user.userHomeChoose);
	app.post("/updatePassword", _user.changePassword); // changer de mot de passe
	app.post("/activeAndDesactionUser", _user.activeAndDesactiveUser) // active and desactive user using status
	app.get("/:userId/userAction", _user.userActions) // user action

}
