var express     = require("express");
var router      = express.Router();
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");
var User        = require("../models/user");
var passport    = require("passport");

// LANDING
router.get("/", function(req,res){
    res.render("landing");
});

// =========================================
//   AUTH ROUTES
// =========================================

// REGISTER FORM
router.get("/register", function(req, res){
    res.render("register"); 
});

// REGISTER ROUTE
router.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    }); 
});

// LOGIN FORM
router.get("/login", function(req, res){
    res.render("login");
});

// LOGIN ROUTE
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
        console.log(err);
        req.flash("error", err.message);
        res.redirect("/login");
    }
    if (!user) { 
        return res.redirect("/login"); 
    }
    req.logIn(user, function(err) {
        if (err) { 
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/login") ;
        }
        return res.redirect("/campgrounds");
    });
  })(req, res, next);
});

// LOGOUT ROUTE
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Successfully logged out");
    res.redirect("/campgrounds");
});

module.exports = router;