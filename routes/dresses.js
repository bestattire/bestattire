var express = require("express");
var router = express.Router();
Dress = require("../models/dresses");

//ATTIRES

router.get("/dresses", isLoggedIn, function(req,res){
	Dress.find({},function(err,alldress){
		if(err){
			console.log(err);
		}else{
			res.render("dresses",{dresses:alldress});
		}
	});
});

router.post("/dresses",function(req,res){
	var type=req.body.type;
	var image=req.body.image;
	var description=req.body.description;
	var newdress={type:type, image:image, description:description};
	Dress.create(newdress,function(err,newlyadded){
		if(err){
			console.log(err);
		}else{
			res.redirect("/dresses");
		}
	});
});

router.get("/dresses/new",function(req,res){
	res.render("new");
});

//SHOW-shows more info about one dress
router.get("/dresses/:id",function(req,res){
	Dress.findById(req.params.id,function(err, searcheddress){
		if(err){
			console.log(err);
		}else{
			res.render("show", {dresses: searcheddress});
		}
	});
});

//edit route
router.get("/dresses/:id/edit",function(req,res){
	Dress.findById(req.params.id, function(err,searcheddress){
		if(err){
			res.redirect("/dresses");
		}else{
			res.render("edit",{dresses: searcheddress});
		}
	});
});

//update route
router.put("/dresses/:id", function(req,res){
	Dress.findByIdAndUpdate(req.params.id,req.body.dresses,function(err,updatedress){
		if(err){
			res.redirect("/dresses");
		}else{
			res.redirect("/dresses/"+req.params.id);
		}
	});
});

//delete route
router.delete("/dresses/:id",function(req,res){
	Dress.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/dresses");
		}else{
			res.redirect("/dresses");
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
