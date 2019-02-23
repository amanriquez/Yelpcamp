
let express = require("express");
let router = express.Router();
const Record = require("../models/record")


//INDEX ROUTE - show all campgrounds

router.get("/records", function (req, res) {

    //get all campgrounds from DB
    //Campground = Jazz bar rename here, in require, and in model..and in Campground.create

    Record.find({}, function (error, allRecords) {
        if (error) {
            console.log(error)
        } else {
            res.render("records/index", {
                records: allRecords,
                currentUser: req.user
            })
        }
    });
})

//get data form and add to campgrounds array
//redirect back to campgrounds page

//CREATE route add new campground to database

router.post("/records", function (req, res) {

    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let newRecord = {
        name: name,
        image: image,
        description: description
    };
    //create new campground and save to DB
    Record.create(newRecord, function (error, newlyCreated) {
        if (error) {
            console.log(error);
        } else {
            res.redirect("/records");
        }
    });

})

// NEW show form to create new campground

router.get("/records/new", function (req, res) {
    res.render("records/new");
})

//SHOW - shows more info about one campground

router.get("/records/:id", function (req, res) {
    //find the cmapground with provided id;
    //check this out, 8:30 from comment model
    Record.findById(req.params.id).populate("comments").exec(function (error, foundRecord) {
        if (error) {
            console.log(error);
        } else {
            res.render("records/show", {
                record: foundRecord
            })
        }

    })

})


module.exports = router;