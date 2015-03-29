var mongoose = require('mongoose');
var artistSchema = require('./artist');
var venueSchema = require('./venue');

var eventSchema = new mongoose.Schema({
    name: String, //
    location_string: String, // like "New York, NY"
    location: { // indexed for geospatial queries
        type: { type: String},
        coordinates: []
    },
    artists: [artistSchema],
    venue: [venueSchema], // TODO figure out how to do this.
    start_time: Date,
    end_time: Date
});

eventSchema.index({location: '2dsphere'});

module.exports = eventSchema;