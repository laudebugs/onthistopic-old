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
app.use(express.static(publicPath));
console.log("here")

console.log(publicPath)
console.log("here")

//view engine setup
app.set('view engine', 'hbs');

// TODO: require the schemas and add the models to mongoose
require('./db');
const Theme = mongoose.model('Theme');
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

//middleware to check if user is logged in
function loggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/login');
    }
  }

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

//Themes page
app.get('/themes', function(req, res){
    Theme.find({}, (err, themes)=>{
        res.render('themes', {themes:themes})
    })
})
app.post('/themes', function(req, res){
    res.redirect('/themes');
})

app.post('/themes/add', function(req, res){
    const t = new Theme({
        themeName: req.body.name
    })
    t.save((err)=>{
        if(err){
            res.status(500).json({saved:false})
        }else{
            res.json({saved:true, result: req.body.name})
        }
    });
});

app.post('/themes/addThemeContent', function(req, res){
    //Get theme object to save content  
    Theme.find({themeName:req.body.name},(err, foundTheme)=>{
        if(err){
            console.log("Not found theme")
        }else{
            //Split the string of links
            links = req.body.content.split(",")
            for (let i=0; i<links.length; i++){
                const p = new Podcast({
                    embed_link:links[i]
                })
                p.save((err)=>{
                    console.log("saving to theme")
                    // Update the theme
                    Theme.updateOne({
                        themeName:req.body.name
                    },{
                        $push:{
                            podcasts:p._id
                        }
                    }).exec(function(err, res){
                        if(err){
                            console.log('cannot update theme with podcast')
                        }
                        else{
                            console.log('Success in updating', res)
                        }
                    })
                })
            }
        }
    })
    //For each podcast link, create a new object and add the reference to the theme

})
app.get('/theme-content', function(req, res){
    res.redirect('/theme/?theme='+req.query.theme)
});
app.get('/theme', function(req, res){
    Theme.find({themeName:req.query.theme}, function(err, target){
        if(err){
            console.log("cannot find your theme")
        }else{
            console.log("theme is:",req.query.theme)
            pods = [];
            arr = target[0].podcasts
            console.log(arr)
            for(let i=0; i<arr.length; i++){
                Podcast.find({_id:arr[i]}, function(err, pod){
                    if (err){console.log("didn't find pod")}
                    else{
                        console.log("found your pod: ", pod[0].embed_link)
                        pod.push(pod[0].embed_link)}
                })
            }
            console.log("here",pods)
            res.render('topic', {page:req.query.theme,podcasts:pods})
        }
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

//my account page
app.get('/myaccount', loggedIn, function(req, res){
    if (req.user) {
        // logged in
        res.render('myaccount.hbs');
    } else {
        // not logged in
        res.redirect('/login')
    }
})
app.get('/temp', function(req, res){
    
    res.render('temp.hbs');
})


app.listen(process.env.PORT || 3002)