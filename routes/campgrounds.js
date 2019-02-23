
let express = require("express");
let router = express.Router();
const Campground = require("../models/campground")


//INDEX ROUTE - show all campgrounds

router.get("/campgrounds", function (req, res) {

    //get all campgrounds from DB
    //Campground = Jazz bar rename here, in require, and in model..and in Campground.create

    Campground.find({}, function (error, allCampgrounds) {
        if (error) {
            console.log(error)
        } else {
            res.render("campgrounds/index", {
                campgrounds: allCampgrounds,
                currentUser: req.user
            })
        }
    });
})

//get data form and add to campgrounds array
//redirect back to campgrounds page

//CREATE route add new campground to database

router.post("/campgrounds", function (req, res) {

    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let newCampground = {
        name: name,
        image: image,
        description: description
    };
    //create new campground and save to DB
    Campground.create(newCampground, function (error, newlyCreated) {
        if (error) {
            console.log(error);
        } else {
            res.redirect("/campgrounds");
        }
    });

})

// NEW show form to create new campground

router.get("/campgrounds/new", function (req, res) {
    res.render("campgrounds/new");
})

//SHOW - shows more info about one campground

router.get("/campgrounds/:id", function (req, res) {
    //find the cmapground with provided id;
    //check this out, 8:30 from comment model
    Campground.findById(req.params.id).populate("comments").exec(function (error, foundCampground) {
        if (error) {
            console.log(error);
        } else {
            res.render("campgrounds/show", {
                campground: foundCampground
            })
        }

    })

})


module.exports = router;