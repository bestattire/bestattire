var mongoose = require("mongoose");

var ethnicSchema = new mongoose.Schema({
	type:String,
	image: String,
	description: String
});

module.exports = mongoose.model("Ethnic",ethnicSchema);