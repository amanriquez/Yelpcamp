const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");


router.get("/", function (req, res) {
    res.render("landing");
})


// ===============
//AUTH ROUTES
//===============

//show register form

router.get("/register", function (req, res) {
    res.render("register");
})

//sign up logic

router.post("/register", function (req, res) {

    let newUser = new User({
        username: req.body.username
    })
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);    
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to the Jazz Closet, " + user.username);
            res.redirect("/records");
        })
    })
});


//show login form

router.get("/login", function (req, res) {
    res.render('login');
})


//handlin login logic
//app.post('login/', middleware, callback);
router.post("/login", passport.authenticate("local", {
    successRedirect: "/records",
    failureRedirect: "/login"
}), function (req, res) {});

//logout route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "logged out")
    res.redirect("/records");
});


// function isLoggedIn(req, res, next) {

//     if (req.isAuthenticated()) {
//         return next();
//     }

//     res.redirect("/login");
// }


module.exports = router;