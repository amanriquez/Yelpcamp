let express = require("express");
let router = express.Router();
let Record = require("../models/record");
let Comment = require("../models/comment");


router.get("/records/:id/comments/new", isLoggedIn, function (req, res) {

    Record.findById(req.params.id, function (err, record) {
        if (err) {
            console.log(err)
        } else {

            res.render("comments/new", {
                record: record
            });
        }
    })
})
//Create Comments
router.post("/records/:id/comments", isLoggedIn, function (req, res) {
    //lookup record using id
    Record.findById(req.params.id, function (err, record) {
        if (err) {
            console.log(err)
            res.redirect("/records")
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;                    
                    //save comment
                    comment.save();
                    console.log(comment);
                    record.comments.push(comment);
                    record.save();
                    res.redirect("/records/" + record._id);
                }
            })
        }
    })

    //create new comment
    //connect new comment to record
    //redirect to record show page
})

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/login");
}



module.exports = router;