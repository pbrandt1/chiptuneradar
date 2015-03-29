var mongoose = require('mongoose');

var venueSchema = new mongoose.Schema({
    name: String, //
    location_string: String, // like "New York, NY"
    address_string: String, // one-liner like "35 E St NW, Washington, DC 20001"
    location: { // indexed for geospatial queries
        type: { type: String},
        coordinates: []
    }
});

venueSchema.index({location: '2dsphere'});

module.exports = venueSchema;