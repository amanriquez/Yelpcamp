const Record = require("../models/record");
const Comment = require("../models/comment");



// all the middle ware goes here
let middlewareObject = {};

middlewareObject.checkRecordOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Record.findById(req.params.id, function (err, foundRecord) {
            if (err) {
                req.flash("error", "record not found");
                res.redirect("back")
            } else {
                if (foundRecord.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "you don't have permission to do that");
                    res.redirect("back")
                }
            }
        });
    } else {
        req.flash("error", "please login");
        res.redirect("back");
    }
}

middlewareObject.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        //does user own comment

        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back")
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back")
                }
            }
        });
    } else {
        req.flash("error", "please login")
        res.redirect("back");
    }
}

middlewareObject.isLoggedIn =  function(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please login")
    res.redirect("/login");
}


module.exports = middlewareObject;