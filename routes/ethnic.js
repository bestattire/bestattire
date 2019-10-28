var express = require("express");
var router = express.Router();
var Ethnic = require("../models/ethnic");

//ETHNIC ATTIRES

router.get("/ethnic",isLoggedIn, function(req,res){
	Ethnic.find({},function(err,allethnics){
		if(err){
			console.log(err);
		}else{
			res.render("ethnic",{ethnics:allethnics});
		}
	});
});
router.post("/ethnic",function(req,res){
	var type =req.body.type;
	var image = req.body.image;
	var description = req.body.description;
	var newethnic ={type:type, image:image, description:description};
	Ethnic.create(newethnic,function(err, newlyadded){
		if(err){
			console.log(err);
		}else{
			res.redirect("/ethnic")
		}
	});	
});

router.get("/ethnic/newethnic",function(req,res){
	res.render("newethnic")
})

router.get("/ethnic/:id" , function(req,res){
	Ethnic.findById(req.params.id,function(err,searcheddress){
		if(err){
			console.log(err);
		}else{
			res.render("showethnic",{ethnics: searcheddress})
		}
	});
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

module.exports = router;