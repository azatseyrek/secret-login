//jshint esversion:6
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

//DB kullanimi //
//1.Adim DB connect

mongoose.connect("mongodb://localhost:27017/userDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//2.Adim Schema Olustur
// const userSchema = {
//     email: String,
//     password: String
// };

//sifreleme icin semaya new mongoose.Schema ekliyoruz
const userSchema = new mongoose.Schema({
        email: String,
        password: String
    
});

//sifreleme



userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

//3.Adim model olustur

const User = new mongoose.model("User", userSchema);


app.get('/', function (req, res) {
    res.render("home");
});
app.get('/login', function (req, res) {
    res.render("login");
});
app.get('/register', function (req, res) {
    res.render("register");
});

//4.Adim register.ejs den post edilen veriyi yakalamak icin register route u olustr

app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});


//5.Adim Register yapildi login yapilirken DB deki veriler ile girilen veriler kiyaslanmasi icin login route olusturulur
app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    //kiyaslama kodumuzu yaziyoruz
    User.findOne({
        email: username
    }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render('secrets');
                }
            }
        }
    });
});



























app.listen(3000, function () {
    console.log("Server started on port 3000");
});