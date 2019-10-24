var express = require('express'),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose =require("mongoose"),
	Dress = require("./models/dresses"),
	Ethnic = require("./models/ethnic"),
	Casual = require("./models/casual"),
	passport =require("passport"),
	LocalStrategy=require("passport-local");
	User=require("./models/user");
//mongoose.connect("mongodb://localhost/best_attire", {useNewUrlParser:true});
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser:true});
//mongoose.connect("mongodb+srv://best-attire:best1234@best-attire-6udzw.mongodb.net/test?retryWrites=true&w=majority");
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

app.get("/whatstrending",function(req,res){
	res.render("whatstrending.ejs");
});

//ETHNIC ATTIRES

app.get("/ethnic",isLoggedIn, function(req,res){
	Ethnic.find({},function(err,allethnics){
		if(err){
			console.log(err);
		}else{
			res.render("ethnic",{ethnics:allethnics});
		}
	});
});

app.post("/ethnic",function(req,res){
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

app.get("/ethnic/newethnic",function(req,res){
	res.render("newethnic")
})

app.get("/ethnic/:id" , function(req,res){
	Ethnic.findById(req.params.id,function(err,searcheddress){
		if(err){
			console.log(err);
		}else{
			res.render("showethnic",{ethnics: searcheddress})
		}
	});
});



//CASUAL ATTIRES

app.get("/casual",isLoggedIn,function(req,res){
	Casual.find({},function(err,allcasuals){
		if(err){
			console.log(err);
		}else{
			res.render("casual",{casuals: allcasuals});
		}
	});
});

app.post("/casual",function(req,res){
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

app.get("/casual/newcasual",function(req,res){
	res.render("newcasual")
})

app.get("/casual/:id" , function(req,res){
	Casual.findById(req.params.id,function(err,searcheddress){
		if(err){
			console.log(err);
		}else{
			res.render("showcasual",{casuals: searcheddress})
		}
	});
});

//WESTERN ATTIRES

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
	res.render("new");
});

//SHOW-shows more info about one dress
app.get("/dresses/:id",function(req,res){
	Dress.findById(req.params.id,function(err, searcheddress){
		if(err){
			console.log(err);
		}else{
			res.render("show", {dresses: searcheddress});
		}
	});
});

//LOGIN LOGIC
app.get("/login", function(req,res){
	res.render("login.ejs");
})
app.post("/login", passport.authenticate("local",
	{
		successRedirect: "/whatstrending",
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
			res.redirect("/whatstrending");
		});
	});
});

//logout route
app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/dresses");
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