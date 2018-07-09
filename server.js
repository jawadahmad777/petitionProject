const express = require("express");
const app = express();
const db = require("./db/db.js");
const hb = require("express-handlebars");
const bcrypt = require("./db/bcrypt");
var cookieSession = require("cookie-session");

app.engine(
    "handlebars",
    hb({
        defaultLayout: "main"
    })
);
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

app.get("/home", (req, res) => {
    res.render("home");
});
app.post("/home", (req, res) => {
    if (req.body.hidden == "") {
        res.redirect("/home");
    } else {
        db
            .insertSignature(
                req.session.userId,
                // req.session.firstname,
                // req.session.lastname,
                req.body.hidden
            )
            .then(signature => {
                req.session.signatureId = signature.id;
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
        if (results.length == 0) {
            res.redirect("/signed");
        } else {
            console.log(results);
            res.render("signers", {
                listOfSigners: results
            });
        }
    });
});
app.get("/register", (req, res) => {
    res.render("register");
});
app.post("/register", (req, res) => {
    if (
        req.body.firstname == "" ||
        req.body.lastname == "" ||
        req.body.email == "" ||
        req.body.password == ""
    ) {
        res.redirect("/register");
    } else {
        bcrypt.hashPassword(req.body.password).then(hashedPassword => {
            db
                .createUser(
                    req.body.firstname,
                    req.body.lastname,
                    req.body.email,
                    hashedPassword
                )
                .then(results => {
                    req.session.userId = results.id;
                    req.session.firstname = req.body.firstname;
                    req.session.lastname = req.body.lastname;
                    req.session.email = req.body.email;
                    req.session.hashedPassword = hashedPassword;
                    res.redirect("/home");
                });
        });
    }
});
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
    var userInfo;
    if (req.body.email == "" || req.body.password == "") {
        res.redirect("/login");
    } else {
        db.getEmail(req.body.email).then(results => {
            if (results.length == 0) {
                res.redirect("/login");
            } else {
                userInfo = results[0];
                const hashedPwd = userInfo.hash_password;
                bcrypt
                    .checkPassword(req.body.password, hashedPwd)
                    .then(checked => {
                        if (checked) {
                            req.session.userId = userInfo.id;
                            req.session.firstname = userInfo.firstname;
                            req.session.lastname = userInfo.lastname;
                            req.session.email = userInfo.email;
                            req.session.hashedPassword = hashedPwd;
                            res.redirect("/home");
                        } else {
                            console.log("results are there");
                            res.redirect("/login");
                        }
                    });
            }
        });
    }
});

app.get("/profile", (req, res) => {
    res.render("profile");
});
app.post("/profile", (req, res) => {
    if (req.body.age == "" && req.body.city == "" && req.body.url == "") {
        res.redirect("/home");
    } else {
        db
            .insertProfile(
                req.session.userId,
                req.session.age,
                req.session.city,
                req.session.url
            )
            .then(() => {
                res.redirect("/home");
            });
    }
});

app.listen(8080, () => {
    console.log("I'm lestining on port 8080 ...");
});
