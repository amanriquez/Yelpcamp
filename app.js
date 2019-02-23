const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Record = require("./models/record");
const Comment = require("./models/comment")
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
seedDB = require("./seed");


mongoose.connect('mongodb://localhost:27017/jazz_closet', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


let commentRoutes = require("./routes/comments");
const recordRoutes = require("./routes/records");
const indexRoutes =  require("./routes/index")




seedDB();


//PASSPORT CONFIGURATION

app.use(require("express-session")({
    secret: "secreto!",
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


// app.get("/", function(req, res){
//     res.render("landing");
// })

// //INDEX ROUTE - show all records

// app.get("/records", function(req, res){
    
//     //get all records from DB
//     //Campground = Jazz bar rename here, in require, and in model..and in Campground.create

//     Campground.find({}, function(error, allCampgrounds){
//         if (error){
//             console.log(error)
//         } else {
//             res.render("records/index", {records: allCampgrounds, currentUser: req.user})
//         }
//     });
// })

// //get data form and add to records array
// //redirect back to records page

// //CREATE route add new record to database

// app.post("/records", function(req, res){

//     let name = req.body.name;
//     let image = req.body.image;
//     let description = req.body.description;
//     let newCampground = {name: name, image: image, description: description};
//     //create new record and save to DB
//     Campground.create(newCampground, function(error, newlyCreated){
//         if (error){
//             console.log(error);
//         } else{
//             res.redirect("/records");    
//         }
//     });

// })

// // NEW show form to create new record

// app.get("/records/new", function(req, res){
//     res.render("records/new");
// })

// //SHOW - shows more info about one record

// app.get("/records/:id", function(req, res){
//     //find the cmapground with provided id;
//     //check this out, 8:30 from comment model
//     Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground){
//         if (error){
//             console.log(error);
//         } else{
//             res.render("records/show", {record: foundCampground})
//         }

//     }) 
  
// })

// //===========================
// //COMMENTS ROUTES
// //===========================

// app.get("/records/:id/comments/new", isLoggedIn, function(req, res){
    
//     Campground.findById(req.params.id, function(err, record){
//         if (err){
//             console.log(err)
//         } else{

//             res.render("comments/new", {record: record});
//         }
//     }) 
// })

// app.post("/records/:id/comments", isLoggedIn, function(req, res){
//     //lookup record using id
//     Campground.findById(req.params.id, function(err, record){
//         if (err){
//             console.log(err)
//             res.redirect("/records")
//         } else{
//             Comment.create(req.body.comment, function(err, comment){
//                 if (err){
//                     console.log(err);
//                 } else{
//                     record.comments.push(comment);
//                     record.save();
//                     res.redirect("/records/" + record._id);
//                 }
//             })
//         }
//     })

//     //create new comment
//     //connect new comment to record
//     //redirect to record show page
// })

// // ===============
// //AUTH ROUTES
// //===============

// //show register form

// app.get("/register", function(req, res){
//     res.render("register");
// })

// //sign up logic

// app.post("/register", function(req, res){

//     let newUser = new User({username: req.body.username})
//     User.register(newUser, req.body.password, function(err, user){
//         if (err){
//             console.log(err);
//             return res.render("register");
//         }
//         passport.authenticate("local")(req, res, function(){
//             res.redirect("/records");
//         })
//     })
// });


// //show login form

// app.get("/login", function(req, res){
//     res.render('login');
// })


// //handlin login logic
// //app.post('login/', middleware, callback);
// app.post("/login", passport.authenticate("local", 
//             {
//                 successRedirect: "/records",
//                 failureRedirect: "/login"
//             }),function(req, res){
// });

// //logic route
// app.get("/logout", function(req, res){
//     req.logout();
//     res.redirect("/records");
// });



// function isLoggedIn(req, res, next){

//     if (req.isAuthenticated()){
//         return next();
//     }

//     res.redirect("/login");
// }


app.use(indexRoutes);
app.use(recordRoutes);
app.use(commentRoutes);


app.listen(3000, function(){
    console.log("server has started!")
});


