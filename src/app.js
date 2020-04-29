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
//view engine setup

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

app.set('view engine', 'hbs');

/// Routes ///
//homepage
app.get('/', function(req, res){
    console.log(req.user)
    res.render('home.hbs', {usr:req.isAuthenticated()});
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
app.get('/logout', loggedIn, function(req, res){
    req.logout();
    res.redirect('/');
    });

//Themes page
app.get('/themes', function(req, res){
    Theme.find({}, (err, themes)=>{
        res.render('themes', {themes:themes})
    })
})

app.post('/themes', loggedIn, function(req, res){
    console.log("trying to save")
    Theme.countDocuments({themeName:req.body.theme}, (err, count)=>{
        console.log(req.body.theme)
        if(err){
            console.log(err)
        }
        else{
            if(count===0){
                console.log("document doesn't exist")
                const t = new Theme({
                    themeName: req.body.theme
                });
                t.save((err)=>{
                    if(err){
                        res.status(500).json({saved:false})
                    }else{
                        //Update user with theme
                        User.updateOne({
                            _id:req.user._id
                        },{
                            $push:{
                                podcasts:t._id
                            }
                        }).exec(function(err, result){
                            if(err){
                                console.log('cannot update user with podcast')
                            }
                            else{
                                console.log('Success in updating user with podcast', result)
                            }
                        })
                        res.redirect('/themes')
                    }
                });
            }
            else if(count>0){
                console.log("document doesn't exist")
                res.redirect('/themes')
            }
        }
    })
});

//Get a theme's content
app.get('/theme', function(req, res){
    list = []
    console.log("HERE:", req.query.theme)
    Theme
        .findOne({themeName:req.query.theme}, function(err, found){
            if (found===null || err){res.redirect('/404')}
            else{
                Theme
                    .findOne({themeName:req.query.theme})
                    .populate('podcasts').exec((err, podcasts)=>{
                        list = podcasts.podcasts;
                        pods = []
                        for(let i=0; i<list.length; i++){
                            pods.push(list[i].embed_link)
                        }
                        console.log("List: ",list)
                        console.log("Pods:", pods)
                        res.render('topic',{page:req.query.theme,podcasts:list})
                    });
            }
        })
    
});
//Add a podcast to the theme
app.get('/howTo', function(req, res){
    res.render('howto');
})
app.post('/theme',function(req, res){
    podname = req.query.theme;
    addPod = req.body.link;
    console.log("theme to add pod is:", podname)
    console.log(addPod)
    const p = new Podcast({
        embed_link:addPod,
        added_by:req.user._id
    })
    p.save((err)=>{
        console.log("saving to theme")
        // Update the theme
        Theme.updateOne({
            themeName:podname
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
            //Update user with podcast  
            User.updateOne({
                _id:req.user._id
            },{
                $push:{
                    podcasts:p._id
                }
            }).exec(function(err, res){
                if(err){
                    console.log('cannot update user with podcast')
                }
                else{
                    console.log('Success in updating user with podcast', res)
                }
            })
            }
        })
    })
    res.redirect(`/theme/?theme=${podname}`);
    
})
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
app.get('/myaccount', loggedIn,  function(req, res){
    
    
    console.log(req.user.username)
    res.render('myaccount', {user: req.user.username})
})

app.get('/404', function(req, res){
    res.render('404')
})
app.listen(process.env.PORT || 3002)