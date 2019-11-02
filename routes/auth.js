var express = require("express");
var router = express.Router();
var passport =require("passport"),
	User=require("../models/user");


router.get("/", function(req,res){
	res.render("mainpage");
});

//LOGIN LOGIC
router.get("/login", function(req,res){
	res.render("login");
});

router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/dresses",
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
			req.flash("error", err.message);
			return res.redirect("/signup");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to Best Attires"+user.username);
			res.redirect("/dresses");
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
	req.flash("error","Please login first!");
	res.redirect("/login");
};

module.exports = router;