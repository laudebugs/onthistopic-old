const mongoose = require('mongoose');

//my schema goes here
//Define the data in our collection
const Log = new mongoose.Schema({
    author: String, 
    date: Date,
    title: String,
    content: String
});
// "Register" the schema so that mongoose knows about it
mongoose.model('Log', Log);

//mongoose.connect('mongodb://localhost/hw06',{ useNewUrlParser: true, useUnifiedTopology: true });
