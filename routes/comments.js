let express = require("express");
let router = express.Router();
let Record = require("../models/record");
let Comment = require("../models/comment");
const middleware = require("../middleware");


router.get("/records/:id/comments/new", middleware.isLoggedIn, function (req, res) {

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
router.post("/records/:id/comments", middleware.isLoggedIn, function (req, res) {
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
                    req.flash("success", "Succesfully added comment")
                    res.redirect("/records/" + record._id);
                }
            })
        }
    })

    //create new comment
    //connect new comment to record
    //redirect to record show page
})

//records/:id/comments/:comment_id/edit
//comments edit route
router.get("/records/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err){
            res.redirect("back");
        } else{

            res.render("comments/edit", {record_id: req.params.id, comment: foundComment});
        }
    });
});
//comment update

router.put("/records/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){

    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err){
            res.redirect("back");
        } else{
            res.redirect("/records/" + req.params.id);
        }
    })

})

//crecord destroy route /records/:id as delete request
//comment destroy route 

router.delete("/records/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findById and remove 
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "Comment deleted");
            res.redirect("/records/" + req.params.id);
        }
    })
})

// function checkCommentOwnership(req, res, next) {
//     if (req.isAuthenticated()) {
//         //does user own record

//         Comment.findById(req.params.comment_id, function (err, foundComment) {
//             if (err) {
//                 res.redirect("back")
//             } else {
//                 if (foundComment.author.id.equals(req.user._id)) {
//                     next();
//                 } else {
//                     res.redirect("back")
//                 }
//             }
//         });
//     } else {
//         res.redirect("back");
//     }
// }

// function isLoggedIn(req, res, next) {

//     if (req.isAuthenticated()) {
//         return next();
//     }

//     res.redirect("/login");
// }



module.exports = router;