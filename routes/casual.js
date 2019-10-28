var express = require("express");
var router = express.Router();
Casual = require("../models/casual");

//CASUAL ATTIRES

router.get("/casual",isLoggedIn,function(req,res){
	Casual.find({},function(err,allcasuals){
		if(err){
			console.log(err);
		}else{
			res.render("casual",{casuals: allcasuals});
		}
	});
});

router.post("/casual",function(req,res){
	var type =req.body.type;
	var image = req.body.image;
	var description = req.body.description;
	var newcasual ={type:type, image:image, description:description};
	Casual.create(newcasual,function(err,newlyadded){
		if(err){
			console.log(err);
		}else{
			res.redirect("/casual");
		}
	});
});

router.get("/casual/newcasual",function(req,res){
	res.render("newcasual")
})

router.get("/casual/:id" , function(req,res){
	Casual.findById(req.params.id,function(err,searcheddress){
		if(err){
			console.log(err);
		}else{
			res.render("showcasual",{casuals: searcheddress})
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