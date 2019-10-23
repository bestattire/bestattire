var mongoose = require("mongoose");

var dressSchema = new mongoose.Schema({
	type:String,
	image:String,
	description:String
});

module.exports = mongoose.model("Dress",dressSchema);