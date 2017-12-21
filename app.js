const Campground = require("./models/campground");
const bodyParser = require("body-parser");
const mongoose   = require("mongoose");
const User = require("./models/user");
const Comment = require("./models/comment");
const express    = require("express");
const mongoDb    = require("mongodb");
const path       = require("path")
const seedDb     = require("./seeds");
const app        = express();

seedDb();

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp_camp",{useMongoClient: true});

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

//Beginning of RESTful routing

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log("Error: ", err);
        } else {
            res.render("index", { campgrounds });
        }
    });
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new")
});

app.post("/campgrounds", (req,res) => {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;

    var newGrounds = {name, image, description};
    Campground.create(newGrounds, (err, newGrounds) => {
        if (err) {
            console.log("Error: ", err);
        } else {
            // Redirect goes back to certain route, not a view name.
            res.redirect("/campgrounds");
        }
    });
});

// SHOW
app.get("/campgrounds/:id", (req, res) => {
    var campId = req.params.id;
    Campground.findById(campId, (err, fetchedGround) => {
        if (err) {
            console.log("Error: ", err);
        } else {
            // Setting the object 'campgrounds' to what we retrieved by 'findById()'
            res.render("show", { campgrounds: fetchedGround });
        }
    });
});



var port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`YelpCamp running on port ${port}`);
});