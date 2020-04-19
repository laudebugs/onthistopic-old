const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const http = require('http');
const mongoose = require('mongoose');
const publicPath = path.resolve(__dirname, "public");

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));


// TODO: require the schemas and add the models to mongoose
require('./db');
const Topic = mongoose.model('Topic');
const Resource = mongoose.model('Resource');
const User = mongoose.model('User');
const Note = mongoose.model('Note');


app.use(express.static("public"));
app.use(session({ secret: "cats" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});
// mongoose
//mongoose.connect('mongodb://localhost/passport_local_mongoose');

// routes
require('./routes')(app);

app.listen(20908);