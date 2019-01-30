var express     = require("express");
var router      = express.Router();
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");
var middleware  = require("../middleware");
var multer      = require('multer');
var dotenv      = require('dotenv').config();

var storage     = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var upload = multer({storage: storage, fileFilter: imageFilter});

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dqszqcsyv', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


// INDEX
router.get("/", function(req,res){
    // Get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err.message);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds}); 
        }
    });
});

// NEW - CAMPGROUND
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new"); 
});

// SHOW 
router.get("/:id", function(req,res){
    // find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err.message);
            req.flash("error", "Campground not found!");
            res.redirect("/campgrounds");
        } else {
            if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// CREATE - CAMPGROUND
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res){
    if(!req.file){
        req.flash("error", "Please upload a file");
        res.redirect("back");
    }
    cloudinary.uploader.upload(req.file.path, function(result) {
        // add cloudinary url for the image to the campground object under image property
        req.body.campground.image = result.secure_url;
        // add author to campground
        req.body.campground.author = {
        id: req.user._id,
        username: req.user.username
        }
        Campground.create(req.body.campground, function(err, campground) {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
        res.redirect('/campgrounds/' + campground.id);
        });
    });
});

// EDIT CAMPGROUND 
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err.message);
            req.flash("error", "Error finding campground");
        } else {
            if (!foundCampground) {
                req.flash("error", "Item not found.");
                return res.redirect("back");
            }
        }
        res.render("campgrounds/edit", {campground:foundCampground});
    });
});

// UPDATE CAMPGROUND
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // Find campground and update 
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            console.log(err.message);
            req.flash("error", "Error updating campground");
            res.redirect("/campgrounds");
        } else {
            //Redirect to show page 
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


// DESTROY CAMPGROUND
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, deletedCampground){
        if(err){
            console.log(err.message);
            req.flash("error", "Error deleting campground");
            res.redirect("/campgrounds/" + req.params.id);
        }
        
        res.redirect("/campgrounds");
    }); 
});


module.exports = router;