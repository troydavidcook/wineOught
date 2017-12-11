const express = require("express");
const path = require("path")
const bodyParser = require("body-parser");
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("home");
});









var port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});