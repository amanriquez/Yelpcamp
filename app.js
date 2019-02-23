const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment")
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
seedDB = require("./seed");


mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

seedDB();


//PASSPORT CONFIGURATION

app.use(require("express-session")({
    secret: "once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})


app.get("/", function(req, res){
    res.render("landing");
})

//INDEX ROUTE - show all campgrounds

app.get("/campgrounds", function(req, res){
    
    //get all campgrounds from DB
    //Campground = Jazz bar rename here, in require, and in model..and in Campground.create

    Campground.find({}, function(error, allCampgrounds){
        if (error){
            console.log(error)
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user})
        }
    });
})

//get data form and add to campgrounds array
//redirect back to campgrounds page

//CREATE route add new campground to database

app.post("/campgrounds", function(req, res){

    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let newCampground = {name: name, image: image, description: description};
    //create new campground and save to DB
    Campground.create(newCampground, function(error, newlyCreated){
        if (error){
            console.log(error);
        } else{
            res.redirect("/campgrounds");    
        }
    });

})

// NEW show form to create new campground

app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
})

//SHOW - shows more info about one campground

app.get("/campgrounds/:id", function(req, res){
    //find the cmapground with provided id;
    //check this out, 8:30 from comment model
    Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground){
        if (error){
            console.log(error);
        } else{
            res.render("campgrounds/show", {campground: foundCampground})
        }

    }) 
  
})

//===========================
//COMMENTS ROUTES
//===========================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err)
        } else{

            res.render("comments/new", {campground: campground});
        }
    }) 
})

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    //lookup campground using id
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err)
            res.redirect("/campgrounds")
        } else{
            Comment.create(req.body.comment, function(err, comment){
                if (err){
                    console.log(err);
                } else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })

    //create new comment
    //connect new comment to campground
    //redirect to campground show page
})

// ===============
//AUTH ROUTES
//===============

//show register form

app.get("/register", function(req, res){
    res.render("register");
})

//sign up logic

app.post("/register", function(req, res){

    let newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        })
    })
});


//show login form

app.get("/login", function(req, res){
    res.render('login');
})


//handlin login logic
//app.post('login/', middleware, callback);
app.post("/login", passport.authenticate("local", 
            {
                successRedirect: "/campgrounds",
                failureRedirect: "/login"
            }),function(req, res){
});

//logic route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});



function isLoggedIn(req, res, next){

    if (req.isAuthenticated()){
        return next();
    }

    res.redirect("/login");
}


app.listen(3000, function(){
    console.log("server has started!")
});


