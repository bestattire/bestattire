var mongoose = require("mongoose");

var casualSchema = new mongoose.Schema({
	type:String,
	image: String,
	description: String
});

module.exports = mongoose.model("Casual",casualSchema);