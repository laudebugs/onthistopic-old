const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const http = require('http');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
const publicPath = path.resolve(__dirname, "public");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

const app = express();

//view engine setup
app.set('view engine', 'hbs');

// TODO: require the schemas and add the models to mongoose
require('./db');
const Topic = mongoose.model('Topic');
const Podcast = mongoose.model('Podcast');
const User = mongoose.model('User');
const Note = mongoose.model('Note');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
// app.use(express.cookieSession({
//     key: "mysite.sid.uid.whatever",
//     secret: process.env["SESSION_SECRET"],
//     cookie: {
//       maxAge: 2678400000 // 31 days
//     },
//   }));
app.use(session({
    secret: 'keyboard cat',
    keys: ['secretkey1', 'secretkey2', '...']}
    ));
app.use(flash());

app.use(express.static(publicPath));

//Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Configure passort-local to use User model for authentication
// Configure passport-local to use account model for authentication
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Connect mongoose 
mongoose.connect('mongodb://localhost/fnp', { useNewUrlParser: true, useUnifiedTopology: true }, function(err) {
  if (err) {
    console.log('Could not connect to mongodb on localhost. Ensure that you have mongodb running on localhost and mongodb accepts connections on standard ports!');
  }
});
mongoose.set('useCreateIndex', true);


/// Routes ///
//homepage
app.get('/', function(req, res){
    console.log(req.user)
    res.render('home.hbs', {user:req.user});
})

//register page
app.get('/register', function(req, res){
    
    res.render('register.hbs', {option:"login"});
})
app.post('/register', function(req, res) {
    console.log('registering new user');
    User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
        if (err) {
            console.log('error while user register!', err);
            return next(err);
        }

        console.log('user registered!');

        res.redirect('/');
    });
});

//log in page
app.get('/login', function(req, res){
    
    res.render('login', {option:"login", user: req.user, message: req.flash('error')});
})
app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
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
        res.render('topic.hbs', {page:"hope",podcasts:pods})
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
app.get('/timeline', function(req, res){
    
    res.render('timeline.hbs');
})

//my account page
app.get('/foryou', function(req, res){
    
    res.render('4u.hbs');
})

//middleware to check if user is logged in
function loggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/login');
    }
  }

//my account page
app.get('/myaccount', loggedIn, function(req, res){
    
    res.render('myaccount.hbs');
})
app.get('/temp', function(req, res){
    
    res.render('temp.hbs');
})


app.listen(process.env.PORT || 3002)