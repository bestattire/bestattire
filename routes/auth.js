var express = require("express");
var router = express.Router();
var passport =require("passport"),
	User=require("../models/user");


router.get("/", function(req,res){
	res.render("mainpage");
});

router.get("/knowmore",function(req,res){
	res.render("knowmore");
});

router.get("/whatstrending",function(req,res){
	res.render("whatstrending.ejs");
});

//LOGIN LOGIC
router.get("/login", function(req,res){
	res.render("login.ejs");
})
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/whatstrending",
		failureRedirect: "/login"
	}), function(req,res){
});

//SIGNUP LOGIC
router.get("/signup",function(req,res){
	res.render("signup.ejs");
});
router.post("/signup",function(req,res){
	var newuser = new User({username: req.body.username});
	User.register(newuser, req.body.password, function(err,user){
		if(err){
			console.log(err);
			return res.render("signup");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/whatstrending");
		});
	});
});

//logout route
router.get("/logout",function(req,res){
	req.logout();
	res.redirect("/dresses");
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

module.exports = router;