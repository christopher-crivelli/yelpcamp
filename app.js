// REQUIRE DEPENDENCIES 

var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    LocalStrategy           = require("passport-local"),
    flash                   = require('connect-flash'),
    passport                = require("passport"),
    expressSession          = require("express-session"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    Campground              = require("./models/campground"),
    User                    = require("./models/user"),
    Comment                 = require("./models/comment"),
    methodOverride          = require("method-override"),
    commentRoutes           = require("./routes/comments"), 
    campgroundRoutes        = require("./routes/campgrounds"), 
    indexRoutes             = require("./routes/index"),
    seedDB                  = require("./seeds");
    
// APP SETUP
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
mongoose.connect(process.env.databaseURL, { useNewUrlParser: true });
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// DATABASE SEEDING
//seedDB();

// PASSPORT CONFIGURATION 
app.use(require("express-session")({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// GLOBAL APPLICATION VARIABLES
app.use(function(req, res, next){
    // Currently logged in user 
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// USE ROUTES FILES 
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// SET UP SERVER
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server has started!"); 
});