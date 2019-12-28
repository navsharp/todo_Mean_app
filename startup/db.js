const mongoose = require('mongoose');

const config = require('../config/database');

module.exports = function(){
    mongoose.connect(config.database,{ useNewUrlParser: true ,useUnifiedTopology: true})
        .then(()=>{console.log("Connected to database "+config.database)})
        .catch((err)=>{console.log("Error in database connection "+err)})
}