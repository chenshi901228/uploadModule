var mongoose = require('mongoose');
require("./model/imgs")
var dbURI = 'mongodb://localhost/test';
mongoose.connect(dbURI);
mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});