module.exports = (app) => {
	const  _login = require("../controllers/Login.controller");

	app.post("/userLogin", _login.loginUser);
	
}