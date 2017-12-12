const express = require("express");
const path = require("path")
const bodyParser = require("body-parser");
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var campgrounds = [
    { name: "Big River", image: "http://www.diabetes.org/assets/img/community/camp/night-camp-fire.jpg"},
    { name: "Bents Camp", image: "http://bents-camp.com/2016/wp-content/uploads/2016/05/Bents-Camp-edited.jpg"},
    { name: "Milky Way Camp", image: "https://media.wired.com/photos/599b4cfd4fa6fc733c11e30d/master/pass/iStock-820873602.jpg"},
    { name: "Wilderness Camp", image: "http://www.wilderness-safaris.com/media/Camps/Botswana/Kwetsani%20Camp/10.CampGallery/kwetsani-galth.jpg"},
]

// Beginning of RESTful routing

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/campgrounds", (req, res) => {
    res.render("campgrounds", { campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new")
});

app.post("/campgrounds", (req,res) => {
    var name = req.body.name;
    var image = req.body.image;
    console.log(name);
    console.log(image);
    var newGrounds = {name, image};
    campgrounds.push(newGrounds);
    res.redirect("/campgrounds");
});









var port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});