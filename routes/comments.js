let express = require("express");
let router = express.Router();
let Campground = require("../models/campground");
let Comment = require("../models/comment");


router.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res) {

    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err)
        } else {

            res.render("comments/new", {
                campground: campground
            });
        }
    })
})

router.post("/campgrounds/:id/comments", isLoggedIn, function (req, res) {
    //lookup campground using id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err)
            res.redirect("/campgrounds")
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
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

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/login");
}



module.exports = router;