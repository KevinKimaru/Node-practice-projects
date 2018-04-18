const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = new express();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
mongoose.connect("mongodb://127.0.0.1/jwttest");
var userSchema = new Schema({
    email: {type: String, required: true},
    pass: {type: String, required: true}
});
var User = mongoose.model('User', userSchema);
bcrypt.hash('kevin', 10, function(err, hash) {
    if(err) throw err;
    var user = new User({
        email: 'kev@gmail.com',
        pass: hash
    });
    // user.save();
});


const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const jwt = require('jsonwebtoken');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_OR_KEY
};
const strategy = new JwtStrategy(opts, (payload, next) => {
    console.log(payload);
    User.findById({_id: payload.id}, function(err, user) {
        if(err) throw err;
        next(null, user);
    });
});
passport.use(strategy);
app.use(passport.initialize());

const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());


app.get('/', (req, res) => {
    res.send('Hello world');
}); 

app.post('/sendUser', (req, res) => {
    if(!req.body.email || !req.body.pass) {
        return res.status(401).send('No fields');
    }
    bcrypt.hash(req.body.pass, 10, function(err, hash) {
        if(err) throw err;
        var user = new User({
            email: req.body.email,
            pass: hash
        });
        user.save(function(err, user) {
            res.send('OK');
        });
    });
});

app.post('/getToken', (req, res) => {
    if(!req.body.email || !req.body.pass) {
        return res.status(401).send('No fields');
    }
    User.findOne({email: req.body.email}, function(err, user) {
        if(!user) {
            res.status(400).send('User not found');
        }
        bcrypt.compare(req.body.pass, user.pass, function(err, result) {
            if(result) {
                const payload = {id: user._id};
                const token = jwt.sign(payload, process.env.SECRET_OR_KEY);
                res.send(token);
            } else {
                res.status(401).send('BOO');
            }
        });
        
    });
});

app.get('/protected', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.send('I am protected');
});

const PORT = process.env.PORT || 3500;

app.listen(PORT);