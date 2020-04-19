const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Topic = new mongoose.Schema({
    title: String,
    added_by: {type: Schema.Types.ObjectId, ref: 'User'},
    rating:[0,0,0,0,0],
    tags:[String],//Consider making this an object??
    resources: [{type: Schema.Types.ObjectId, ref: 'Resource'}],
    notes: [{type: Schema.Types.ObjectId, ref: 'Note'}]
});
const Resource = new mongoose.Schema({
    embed_link: String,
    type: Number,
    added_by: {type: Schema.Types.ObjectId, ref: 'User'},
    rating:[0,0,0,0,0]
});
const User = new mongoose.Schema({
    notes: [{type: Schema.Types.ObjectId, ref: 'Note'}],
    resources: [{type: Schema.Types.ObjectId, ref: 'Resource'}],
    topics: [{type: Schema.Types.ObjectId, ref: 'Topic'}]
    /**
     * _TODO_: 
     * Add Favourites?
     */
});
User.plugin(passportLocalMongoose);

const Note = new mongoose.Schema({
    resource: {type: Schema.Types.ObjectId, ref: 'Resource'},
    content: String,
    rating:[0,0,0,0,0]
});
// "Register" the schema so that mongoose knows about it
mongoose.model('Topic', Topic);
mongoose.model('Resource', Resource);
mongoose.model('User', User);
mongoose.model('Note', Note);

mongoose.connect('mongodb://localhost/fnp',{ useNewUrlParser: true, useUnifiedTopology: true });
