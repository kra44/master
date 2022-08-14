const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const _url = 'mongodb://localhost:27017/';
const dbName = "lodgingDB"

exports.getDBConnection = function() {
    mongoose.connect(_url+dbName, {
        useNewUrlParser: true,
        useUnifiedTopology:true,
        useFindAndModify: false,
        poolSize:10,
    }).then(() => {
        console.log("Successfully connected to the database");    
    }).catch(err => {
        console.log('Could not connect to the database. Check if mongoose server is running. Exiting now...', err);
        process.exit();
    });
}