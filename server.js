const express = require('express');
const helmet = require("helmet");
const bodyParser = require('body-parser');
const cors=require('cors');
const dbConfig=require('./database/db');
const fs= require('fs');
//path pour donner chemin a l'image 
const path = require('path');
const https=require('https');

//create express appfv
const app = express();

//Helmet helps you secure your Express apps by setting various HTTP headers
app.use(helmet());

const corsOptions = {
    orign:'*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));


///POUR UPLOADER UNE IMAGE

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  // parse requests of content-type - application/x-www-form-urlencoded

  // parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false, limit:'50mb' }));
// parse requests of content-type - application/json
app.use(bodyParser.json({ limit: '10mb' }));

// define a simple route
app.get('/',cors(corsOptions), (req, res) => {
    res.send({"message": "Welcome to MyKipay application (Client) Backend Server. Take notes quickly. Organize and keep track of all your notes. By Kip services et technologie"});
});



dbConfig.getDBConnection();

require('./app/routes/Owner.router')(app);
require('./app/routes/home.router')(app);
require('./app/routes/city.router')(app);
require('./app/routes/user.router')(app);
require("./app/routes/admin.router")(app);
require('./app/routes/login.router')(app);
require('./app/routes/categorie.router')(app);
require('./app/routes/Contact.router')(app);
require('./app/routes/userMail.router')(app);

app.listen(5000, "localhost",()=>{
	console.log("Szerver is runing on port 5000")
})
//lient d'installation de windows 10 => https://www.lesnumeriques.com/ordinateur/tuto-comment-installer-facilement-windows-10-sur-un-pc-a145093.html







