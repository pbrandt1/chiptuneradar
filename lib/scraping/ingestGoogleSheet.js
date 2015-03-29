var needle = require('needle');
var tsv = require('tsv');
var db = require('../chipdb');
var extend = require('extend');

// helper for parsing out social links
var websites = require('./websites');

/*
This file downloads data from a google sheet and puts it in elasticsearch
 */

var key = "14UH1hukA0486F7izROiLGpKnCRyoMJ6ze67GdQPAUeM"; // this is just my copy's key
var tsvLink = "https://docs.google.com/spreadsheets/d/KEY/export?format=tsv".replace("KEY", key);

var sheets = [
    {type: 'Chiptunes', gid: 0, columns: ['Artist', 'Location', 'Website', 'Website2']},
    {type: 'Visualist', gid: 3, columns: ['Artist', 'Location', 'Website', 'Website2']},
    {type: 'VGM', gid: 2, columns: ['Artist', 'Location', 'Website', 'Website2']},
    {type: 'Nerdcore', gid: 4, columns: ['Artist', 'Location', 'Website', 'Website2']},
    {type: 'Netlabel', gid: 7, columns: ['Artist', 'Location', 'Musical Focus', 'Website']}
];

console.log('ingesting google spreadsheet');

// Transform a bunch of tsv docs to JSON and upsert them in mongodb
sheets.map(function(sheet) {
    var url = tsvLink + "&gid=" + sheet.gid;
    needle.get(url, function(err, res) {
       if (err) {
           console.err("Error fetching sheet " + sheet.gid);
           console.err(err);
       } else if (!res.body || res.body.length == 0) {
           console.err("No response for sheet " + sheet.gid);
       } else {
           console.log("got url " + url);
           var parser = new tsv.Parser('\t');
           var json = parser.parse(res.body);

           var artists = json.map(function(o) {
               var artist = {
                   name: o['ARTIST NAME'] || o['LABEL NAME'],
                   location_string: o['   LOCATION'],
                   website: o['   WEBSITE'],
                   website2: o['3'],
                   genre: o['MUSICAL FOCUS'] || sheet.type,
                   chipwinsource: o
               };
               extend(artist, websites([o['   WEBSITE'], o['3']]));
               return artist;
           });

           // probs not the best way to do this since it's just a for loop internally... but whatevs
           db.Artist.create(artists, function(err) {
               if (err) {
                   console.error("Error inserting documents for sheet " + sheet.gid);
                   console.error(err);
               } else {
                   console.log("inserted documents for sheet " + sheet.gid);
               }
           });
       }
    });
});
