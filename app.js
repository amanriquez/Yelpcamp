const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Record = require("./models/record");
const Comment = require("./models/comment")
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const methodOverride = require("method-override");
const flash = require("connect-flash");
seedDB = require("./seed");


mongoose.connect('mongodb://localhost:27017/jazz_closet', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

let commentRoutes = require("./routes/comments");
const recordRoutes = require("./routes/records");
const indexRoutes =  require("./routes/index")


//seed the database
//seedDB();


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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})


app.use(indexRoutes);
app.use(recordRoutes);
app.use(commentRoutes);


app.listen(3000, function(){
    console.log("server has started!")
});


