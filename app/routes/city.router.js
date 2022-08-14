module.exports = (app) => {
	const  _city = require("../controllers/City.controller");

	app.post("/addCity", _city.createNawCity);
	app.put("/updateCity", _city.updateCity);
	app.post("/addTownship", _city.addTownship);
	app.put("/updateTownship", _city.updateTownship);
	app.get("/cityList", _city.cityList);
	app.get("/townshipList/:idCity", _city.getTownshipList);
	app.get("/allTownship", _city.getAllTownship);
	app.get("/getAllTownshipWithCity", _city.getAllCityAndTownship);


}