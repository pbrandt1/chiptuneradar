var mongoose = require('mongoose');

var artistSchema = new mongoose.Schema({
    name: String, //
    location_string: String, // like "New York, NY"
    location: { // indexed for geospatial queries
        type: { type: String, default: 'Point'},
        coordinates: {type: Array, default: [0, 0]}
    },
    chipwinsource: {}, // the original source from the chipwin sheet if exists
    genre: String,
    soundcloud: String,
    soundcloudId: String,
    facebook: String,
    facebookId: String,
    twitter: String,
    bandcamp: String,
    youtube: String,
    tumblr: String,
    wordpress: String,
    myspace: String,
    bandsintown: String,
    personal: String
});

artistSchema.index({location: '2dsphere'});

module.exports = artistSchema;