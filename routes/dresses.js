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

router.post("/dresses",isLoggedIn,function(req,res){
	var type=req.body.type;
	var image=req.body.image;
	var description=req.body.description;
	var author ={
		id: req.user._id,
		username: req.user.username
	}
	var newdress={type:type, image:image, description:description,author:author};
	console.log(req.user);
	Dress.create(newdress,function(err,newlyadded){
		if(err){
			console.log(err);
		}else{
			res.redirect("/dresses");
		}
	});
});

router.get("/dresses/new",isLoggedIn,function(req,res){
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
router.get("/dresses/:id/edit",checkdressowner,function(req,res){
	Dress.findById(req.params.id, function(err,searcheddress){
		res.render("edit",{dresses: searcheddress});
	});
});

//update route
router.put("/dresses/:id",checkdressowner, function(req,res){
	Dress.findByIdAndUpdate(req.params.id,req.body.dresses,function(err,updatedress){
		if(err){
			res.redirect("/dresses");
		}else{
			res.redirect("/dresses/"+req.params.id);
		}
	});
});

//delete route
router.delete("/dresses/:id",checkdressowner,function(req,res){
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

function checkdressowner(req,res,next){
	if(req.isAuthenticated()){
		Dress.findById(req.params.id, function(err,searcheddress){
			if(err){
				res.redirect("/dresses");
			}else{
				if(searcheddress.author.id.equals(req.user._id)){
					next();
				}else{
					res.redirect("back");
				}	
			}
		});
	}else{
		res.redirect("back");
	}
}

module.exports = router;
