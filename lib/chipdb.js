var artistSchema = require('./models/artist');
var eventSchema = require('./models/event');
var venueSchema = require('./models/venue');
var mongoose = require('mongoose');


// takes care of queueing functions
mongoose.connect('mongodb://localhost/chiptuneradar');

module.exports = {
    Artist: mongoose.model('Artist', artistSchema),
    Event: mongoose.model('Event', eventSchema),
    Venue: mongoose.model('Venue', venueSchema)
};

