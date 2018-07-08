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
    //from/
    //db.getSigners();
    res.render("home");
});

app.post("/home", (req, res) => {
    //from/
    if (
        // req.body.firstname == "" ||
        // req.body.lastname == "" ||
        req.body.hidden == ""
    ) {
        res.redirect("/home");
    } else {
        db
            .insertSignature(
                req.session.userId,
                req.session.firstname,
                req.session.lastname,
                req.body.hidden
                // req.body.firstname,
                // req.body.lastname,
            )
            .then(signature => {
                //req.session.signatureId = newUser.id;
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
        // console.log(results);
        res.render("signers", {
            listOfSigners: results
        });
    });
});
app.get("/register", (req, res) => {
    res.render("register");
});
// app.post("/register", (req, res) => {
//     if (
//         req.body.firstname == "" ||
//         req.body.lastname == "" ||
//         req.body.email == "" ||
//         req.body.password == ""
//     ) {
//         res.redirect("/register");
//     } else {
//         bcrypt.hashPassword(req.body.password).then(hashedPassword => {
//             db.createUser(
//                 req.body.firstname,
//                 req.body.lastname,
//                 req.body.email,
//                 hashedPassword
//             ).then(()=>{
//                 res.redirect("/registe");
//             });
//         });
//     }
// });

app.get("/signers", (req, res) => {
    db.getSigners().then(results => {
        // console.log(results);
        res.render("signers", {
            listOfSigners: results
        });
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
    if (req.body.email == "" || req.body.password == "") {
        res.redirect("/login");
    } else {
        db.getEmail(req.body.email).then(results => {
            if (results.length == 0) {
                res.redirect("/login");
            } else {
                const hashedPwd = results.hash_password;
                bcrypt
                    .checkPassword(req.body.password, hashedPwd)
                    .then(checked => {
                        if (checked) {
                            console.log(checked);
                        } else {
                            console.log("results are there");
                            res.redirect("/login");
                        }
                    });
            }
        });
    }
});
app.listen(8080, () => {
    console.log("I'm lestining on port 8080 ...");
});
