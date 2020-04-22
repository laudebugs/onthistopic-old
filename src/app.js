const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const http = require('http');
const mongoose = require('mongoose');
const publicPath = path.resolve(__dirname, "public");

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


app.use(express.static(publicPath));

// TODO: require the schemas and add the models to mongoose
require('./db');
const Topic = mongoose.model('Topic');
const Podcast = mongoose.model('Podcast');
const User = mongoose.model('User');
const Note = mongoose.model('Note');


app.use(express.static("public"));
app.use(session({ secret: "cats" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// mongoose
//mongoose.connect('mongodb://localhost/passport_local_mongoose');



    //homepage
    app.get('/', function(req, res){

        res.render('home.hbs');
    })

    //Sign up page
    app.get('/signup', function(req, res){
        
        res.render('signup.hbs');
    })

    //Sign in page
    app.get('/signup', function(req, res){
        
        res.render('signin.hbs');
    })
    app.post('/signup', function(req, res) {
        User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
            if (err) {
                return res.render('signup', { user : user });
            }

            passport.authenticate('local')(req, res, function () {
            res.redirect('/');
            });
        });
    });

    app.get('/signin', function(req, res) {
        res.render('signin.hbs', { user : req.user });
    });

    app.post('/signin', passport.authenticate('local'), function(req, res) {
        res.redirect('/');
    });

    app.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    //topics page
    app.get('/themes', function(req, res){
        res.render('themes.hbs');
    })
    app.post('/themes', function(req, res){
        res.redirect('/themes');
    })

    app.get('/themes/hope', function(req, res){
        //Podcast.log(podcast_list);
        //var pod_iframes = `<iframe src=${podcast_list[0]}width="100%" height="60" frameborder="0" ></iframe>`;  
        //document.body.innerHTML = pod_iframes;
        
        Podcast.find({}, (err, pods)=>{
            console.log(pods)
            res.render('topic.hbs', {podcasts:pods})
        })
    });
    app.post('/themes/hope', function(req, res){
        const p = new Podcast({
            embed_link: req.body.link
        })
        p.save((err)=>{
            res.redirect('/themes/hope');
        });
    });
    //people page
    app.get('/people', function(req, res){
        
        res.render('people.hbs');
    })

    //map page
    app.get('/map', function(req, res){
        
        res.render('map.hbs');
    })

    //my account page
    app.get('/foryou', function(req, res){
        
        res.render('4u.hbs');
    })

    //my account page
    app.get('/myaccount', function(req, res){
        
        res.render('myaccount.hbs');
    })
    app.get('/temp', function(req, res){
        
        res.render('temp.hbs');
    })


app.listen(process.env.PORT || 3002)