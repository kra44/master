module.exports = (app) => {
	const  _owner_controller = require("../controllers/Owner.controller");

	app.post("/createOwners", _owner_controller.creatsOwner);
	app.put("/owner/updateProfil", _owner_controller.updateOwnerProfil);
	app.get("/ownerProfil/:idOwner", _owner_controller.getOwnerProfil);
	app.get("/allOwner", _owner_controller.getAllOwner);

	app.delete("/deleteOwnerHome/:idHome", _owner_controller.remoovesHome)
}