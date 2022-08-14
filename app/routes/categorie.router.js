module.exports = (app) => {
	const _homeType = require("../controllers/Categorie.controller");

	app.get("/CategorieHome/:idHomeType", _homeType.findAllHomeOfCategorie);
	app.get("/getCategorieHomeByName1/:homeTypeName", _homeType.getCategoriesHomeOne);
	app.get("/getCategorieHomeByName2/:homeTypeName", _homeType.getCategoriesHomeTow);
	app.get("/getCategorieHomeByName3/:homeTypeName", _homeType.getCategoriesHomeTree);
	app.get("/getCategorieHomeByName4/:homeTypeName", _homeType.getCategoriesHomethourt);
	app.get("/categoriHomeData/:homeTypeName", _homeType.getCategoriesHomeData);
}
