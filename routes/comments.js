var express     = require("express");
var router      = express.Router({mergeParams: true});
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");
var middleware  = require("../middleware");

// NEW COMMENT
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
       if(err){
            console.log(err.message);
            req.flash("error", "Campground not found"); 
        } else {
        res.render("comments/new", {campground: campground});
        }
    });
});

// CREATE COMMENT
router.post("/", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err.message);
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds")
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Error creating comment");
                    res.redirect("/campgrounds/" + campground._id);
                } else if(req.body.comment.text.length === 0){
                    return res.redirect("back");
                } else {
                    // add username and id to comment 
                    comment.author.id = req.user._id; 
                    comment.author.username = req.user.username;
                    // save comment 
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });  
});

// EDIT COMMENT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err){
           console.log(err.message);
           req.flash("error", "Error finding comment");
           res.redirect("back");
       } else {
               res.render("comments/edit", {campground_id: req.params.id, comment:foundComment});
       } 
    });
});

// UPDATE COMMENT
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           console.log(err.message);
           req.flash("error", "Error finding comment");
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
})

// DELETE COMMENT 
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndDelete(req.params.comment_id, function(err, deletedComment){
        if(err){
            req.flash("error", "Error deleting comment");
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
   }); 
});

module.exports = router; 