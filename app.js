const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment")
seedDB = require("./seed");

mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

seedDB();

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
            res.render("campgrounds/index", {campgrounds: allCampgrounds})
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

app.get("/campgrounds/:id/comments/new", function(req, res){
    
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err)
        } else{

            res.render("comments/new", {campground: campground});
        }
    }) 
})

app.post("/campgrounds/:id/comments", function(req, res){
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


app.listen(3000, function(){
    console.log("server has started!")
});


