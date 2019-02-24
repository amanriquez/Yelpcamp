
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

router.post("/records", isLoggedIn, function (req, res) {

    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newRecord = {
        name: name,
        image: image,
        description: description,
        author: author
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

router.get("/records/new", isLoggedIn, function (req, res) {
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

// EDIT CAMPGROUND ROUTE

router.get("/records/:id/edit", checkRecordOwnership, function(req, res){

        Record.findById(req.params.id, function(err, foundRecord){
            res.render("records/edit", {record: foundRecord});
        
        });
   
});

//UPDATE CAMPGROUND ROUTE

router.put("/records/:id", checkRecordOwnership, function(req, res){
    //find and update correct campground

    Record.findByIdAndUpdate(req.params.id, req.body.record, function(err, updatedRecord){
        if (err){
            res.redirect("/records");
        } else{
            res.redirect("/records/" + req.params.id);
        }
    });
    //redirect, show page
})


// DESTROY CAMPGROUND ROUTE
router.delete("/records/:id", checkRecordOwnership, function(req, res){
    Record.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.redirect("/records");
        } else{            
            res.redirect("/records");
        }
    })
})


//middleware

function checkRecordOwnership(req, res, next){
    if (req.isAuthenticated()) {
        //does user own record

        Record.findById(req.params.id, function (err, foundRecord) {
            if (err) {
                res.redirect("back")
            } else {
                if (foundRecord.author.id.equals(req.user._id)) {
                    next();
                } else {
                   res.redirect("back")     
                }
            }
        });
    } else {
       res.redirect("back");
    }
}



function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/login");
}



module.exports = router;