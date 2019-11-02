var express = require('express'),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose =require("mongoose"),
	Dress = require("./models/dresses"),
	passport =require("passport"),
	LocalStrategy=require("passport-local"),
	flash = require("connect-flash"),
	methodOverride=require("method-override"),
	User=require("./models/user");
	seedDB = require("./seeds");

var dressesRoutes = require("./routes/dresses"),
	authRoutes = require("./routes/auth");

//seedDB();

//mongoose.connect("mongodb://localhost/best_attire", {useNewUrlParser:true});
var url = process.env.DATABASEURL || "mongodb://localhost/best_attire"
mongoose.connect(url);
//mongoose.connect("mongodb+srv://best-attire:best1234@best-attire-6udzw.mongodb.net/test?retryWrites=true&w=majority");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");

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
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(dressesRoutes);
app.use(authRoutes);

var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("Server has Started");
});