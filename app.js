var express = require('express'),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose =require("mongoose"),
	Dress = require("./models/dresses"),
	passport =require("passport"),
	LocalStrategy=require("passport-local");
	User=require("./models/user");

mongoose.connect("mongodb://localhost/best_attire", {useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set("view engine", "ejs");

/*Dress.create(
{
	type:"western wear",
	image:"https://i1.wp.com/myfaayda.com/wp-content/uploads/2017/11/Upto-80-Off-on-Womens-Western-Dresses.jpeg",
	description:"This is a pretty short blue dress!"
},function(err,dress){
	if(err){
		console.log(err);
	}else{
		console.log("new dress"); 
		console.log(dress);
	}
});*/

//passport configuration
app.use(require("express-session")({
	secret:"keep it secret!",
	resave: false,
	saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
});

app.get("/", function(req,res){
	res.render("mainpage");
});

app.get("/knowmore",function(req,res){
	res.render("knowmore");
});

app.get("/dresses", isLoggedIn, function(req,res){
	Dress.find({},function(err,alldress){
		if(err){
			console.log(err);
		}else{
			res.render("dresses",{dresses:alldress});
		}
	});
});

app.post("/dresses",function(req,res){
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

app.get("/dresses/new",function(req,res){
	res.render("new.ejs");
});

//LOGIN LOGIC
app.get("/login", function(req,res){
	res.render("login.ejs");
})
app.post("/login", passport.authenticate("local",
	{
		successRedirect: "/dresses",
		failureRedirect: "/login"
	}), function(req,res){
});

//SIGNUP LOGIC
app.get("/signup",function(req,res){
	res.render("signup.ejs");
});
app.post("/signup",function(req,res){
	var newuser = new User({username: req.body.username});
	User.register(newuser, req.body.password, function(err,user){
		if(err){
			console.log(err);
			return res.render("signup");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/dresses");
		});
	});
});

//logout route
app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/dresses");
});

app.get("/whatstrending",function(req,res){
	res.render("whatstrending.ejs");
});

//SHOW-shows more info about one campground
app.get("/dresses/:id",function(req,res){
	Dress.findById(req.params.id,function(err, searcheddress){
		if(err){
			console.log(err);
		}else{
			res.render("show", {dresses: searcheddress});
		}
	});
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("Server has Started");
});