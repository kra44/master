module.exports = (app) => {
	const  _home = require("../controllers/Home.controller");
	const { upload } = require("../helpers/helpers")

	app.post("/addHome", upload.array('files'),  _home.addNewHome);  //create home
	app.put("/updateHome", _home.updateHome); // update home
	app.post("/addHomeType", _home.createNewHomeType); // add home type
	app.put("/upadetHomeType", _home.updateHometype); // update home type
	app.get("/:idOwner/allOwnerHome", _home.getAllOwnerHome); // get all home of owner
	app.get("/:idOwner/getAvailableHome", _home.getHomeAvailable); // get owner home available
	app.get("/:idOwner/getNotAvailableHome", _home.getAllHomeNotAvailable); // get owner home not available
	app.post("/decreaseHomeItem", _home.decreaseHomeItem); // decrease owner home item
	app.post("/increaseHomeintem", _home.increaseHomeItem); // increase owner home item
	//app.get("/allHomes", _home.getAllOwnerHome); // get all home
	app.get("/getHome", _home.getHistorique)
	app.get("/allHomeType", _home.getAllHomeType);

	app.get("/oneOwnerHome/:idHome", _home.getOneOwnerHome);
	app.post("/addHomeVideo", upload.array('files'), _home.addHomeVideo);

	app.get("/allHomeHareBusy", _home.allHomeHareBusy); // statisque des maissaon déja occupé;

	app.get("/suplierHome", _home.getSuplierHome); // maison en demande

	app.get("/activeHome/:idHome", _home.validateHouse); // actiev home

	app.post("/updateHouse", _home.updtatHouse)
	app.get("/allResidenceList", _home.getResidence) // all residence liste

	app.get("/:idOwner/statistiqueData", _home.getStatisticalData);


}