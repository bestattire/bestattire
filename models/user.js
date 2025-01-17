var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	username: String,
	password: String
});

//gives all the functionalitites to user model
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);