var mongoose = require("mongoose");

var dressSchema = new mongoose.Schema({
	type:String,
	image:String,
	description:String,
	author:{
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

module.exports = mongoose.model("Dress",dressSchema);