const express = require("express");
const app = express();
const db = require("./db/db.js");
const hb = require("express-handlebars");
app.engine(
    "handlebars",
    hb({
        defaultLayout: "main"
    })
);
app.use(express.static("public"));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "handlebars");

app.get("/", (req, res) => {
    //db.getSigners();
    res.render("home");
});

app.post("/", (req, res) => {
    db
        .insertUser(req.body.firstname, req.body.lastname, req.body.hidden)
        .then(newUser => {
            res.json(newUser);
            // console.log(newUser);
            // res.redirect("/thanks");
        });
});
// app.get("/thanks", (req, res) => {
//     res.send(`<h4>Thanks for ...</h4>`);
// });

app.listen(8080, () => {
    console.log("I'm lestining on port 8080 ...");
});
