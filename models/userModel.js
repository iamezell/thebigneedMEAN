// we need to make a schema for our user so that our user data will ahve structure
// require our mongoose library
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/spotaplacedb');

var schema = new mongoose.Schema({
    name: String,
    email : String,
    password : String,
    salt : String,
    addressStreet: String,
    addressCity : String,
    addressState : String,
    addressProvince : String,
    addressZip : String,
    session :  String,
    verificationNum : String,
    verified : Boolean,
    vendor : Boolean

})

exports.getModel = function(){
    return mongoose.model('user', schema);
}