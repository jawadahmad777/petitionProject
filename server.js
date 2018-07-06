const express = require("express");
const app = express();
const db = require("./db/db.js");
const hb = require("express-handlebars");
// const bc = require("bcr");
var cookieSession = require("cookie-session");

app.engine(
    "handlebars",
    hb({
        defaultLayout: "main"
    })
);
//hash hashPassword
// app.get("/hash-practic", (req, res) => {
//     bc.hashPassword("trjkj").then(hashPassword => {
//         // console.log("hashPassword", hashPassword);
//         bc.checkPassword("trjkj", hashPassword).then(dopassmath=>{
//             console.log('is' ,dopassmath);
//         })
//     });
// });

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
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
    if (
        req.body.firstname == "" ||
        req.body.lastname == "" ||
        req.body.hidden == ""
    ) {
        res.redirect("/");
    } else {
        db
            .insertUser(req.body.firstname, req.body.lastname, req.body.hidden)
            .then(newUser => {
                req.session.signatureId = newUser.id;
                res.redirect("/signed");
            });
    }
});
app.get("/signed", (req, res) => {
    var x;
    db
        .getSignature(req.session.signatureId)
        .then(sign => {
            x = sign;
        })
        .then(sign => {
            db.getSignersCount().then(count => {
                res.render("signed", {
                    signature: x.signature,
                    count: count
                });
            });
        });
});
app.get("/signers", (req, res) => {
    db.getSigners().then(results => {
        // console.log(results);
        res.render("signers", {
            listOfSigners: results
        });
    });
});
app.listen(8080, () => {
    console.log("I'm lestining on port 8080 ...");
});
