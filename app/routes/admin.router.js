module.exports = (app) =>{
	const _admin = require("../controllers/Admin.controller");

	app.post("/createAdmin", _admin.creatsAdmin); // create admin
	app.put("/updateAdmin", _admin.updateAdmin); // update admin
	app.get("/getAdminProfil/:idAdmin", _admin.getAdminProfil); // get one admin
	app.get("/allOwnerList", _admin.allOwnerList); // all owner list
	app.get("/getOwnerById/:idOwner", _admin.getOwnerdetails) // get owern detail with home number
	app.get("/getOwnerHome/:idOwner", _admin.getAllOwnerHome); // get all home of one owner
	app.get("/oneHome/:idHome", _admin.getHomedetails) // get home detail of one owner  
	app.get("/activeOwner/:idOwner", _admin.activeOwner) // active owner
	app.get("/desactiveOwner/:idOwner", _admin.desactiveOwner) // active owner
	app.get("/ownerHomeList/:idOwner", _admin.ownerHomeList) //one owner home list
	app.get("/allhome", _admin.getAllHome) // get all homes 
	app.get("/allUserMessage", _admin.getAllUserMessage); // all user message
	app.get("/alluserList", _admin.allUsersList) // recuperation de la liste de tout les utilisateur

} 