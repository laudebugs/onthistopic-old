const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const path = require('path');

const Theme = new mongoose.Schema({
    themeName: String,
    added_by: {type: Schema.Types.ObjectId, ref: 'User'},
    rating:[0,0,0,0,0],
    tags:[String],//Consider making this an object??
    podcasts: [{type: Schema.Types.ObjectId, ref: 'Podcast'}],
    notes: [{type: Schema.Types.ObjectId, ref: 'Note'}]
});
const Podcast = new mongoose.Schema({
    embed_link: String,
    type: Number,
    added_by: {type: Schema.Types.ObjectId, ref: 'User'},
    rating:[0,0,0,0,0]
});
const User = new mongoose.Schema({
    notes: [{type: Schema.Types.ObjectId, ref: 'Note'}],
    Podcasts: [{type: Schema.Types.ObjectId, ref: 'Podcast'}],
    topics: [{type: Schema.Types.ObjectId, ref: 'Topic'}]
    /**
     * _TODO_: 
     * Add Favourites?
     */
});
User.plugin(passportLocalMongoose);

const Note = new mongoose.Schema({
    Podcast: {type: Schema.Types.ObjectId, ref: 'Podcast'},
    content: String,
    rating:[0,0,0,0,0]
});
// "Register" the schema so that mongoose knows about it
mongoose.model('Theme', Theme);
mongoose.model('Podcast', Podcast);
mongoose.model('User', User);
mongoose.model('Note', Note);

// const publicPath = path.resolve(__dirname, "public");

// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
    // if we're in PRODUCTION mode, then read the configration from a file
    // use blocking file io to do this...
    const fs = require('fs');
    const fn = 'config.json';
    const data = fs.readFileSync(fn);

    // our configuration file will be in json, so parse it and set the
    // conenction string appropriately!
    const conf = JSON.parse(data);
    dbconf = conf.dbconf;
    } else {
    // if we're not in PRODUCTION mode, then use
    dbconf = 'mongodb://localhost/fnp';
}
mongoose.connect(dbconf,{ useNewUrlParser: true, useUnifiedTopology: true });