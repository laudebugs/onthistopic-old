const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const publicPath = path.resolve(__dirname, "public");

// TODO: require the schemas and add the models to mongoose


app.set('view engine','hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(publicPath));

//log out path
app.use((req, res, next)=>{
    console.log('Method: ', req.method,'\nPath: ', req.path);
    next();
  });
//homepage
app.get('/', function(req, res){

    res.render('home.hbs');
})

//Sign up page
app.get('/signup', function(req, res){
    
    res.render('signup-in.hbs');
})

//Sign in page
app.get('/signin', function(req, res){
    
    res.render('signup-in.hbs');
})

//topics page
app.get('/topics', function(req, res){
    
    res.render('topics.hbs');
})
podcast_list = [];

app.get('/topics/hope', function(req, res){
    res.render('topic', {podcasts: podcast_list});
});
app.post('/topics/hope', function(req, res){
    podcast_list.push(req.body.podcast_url)

    res.redirect('/topics/hope');
})
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
app.listen(3000);