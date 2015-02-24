var needle = require('needle');
var tsv = require('tsv');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});
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

// Set up mappings
//needle.post('http://localhost:9200/chiptunes/nested_websites/_mapping', {
//    nested_websites:{
//        "properties":{
//            "websites": {
//                "type": "nested"
//            }
//        }
//    }
//
//}, function(err, res) {
//    if (err) {
//        console.error('nested mapping failed');
//        console.error(err);
//    }
//});

// Transform a bunch of tsv docs to JSON and upsert them in elasticsearch
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

           var bulkRequest = json.map(function(o) {
               var ws = websites([o['   WEBSITE'], o['3']]);
               return {
                   name: o['ARTIST NAME'] || o['LABEL NAME'],
                   location_name: o['   LOCATION'],
                   type: sheet.type,
                   website: o['   WEBSITE'],
                   website2: o['3'],
                   musical_focus: o['MUSICAL FOCUS'] || sheet.type,
                   websites: ws
               }
           }).reduce(function(p, c) {
               p.push({ index:  { _index: 'chiptunes', _type: 'artists'} });
               p.push(c);
               return p;
           }, []);

           client.bulk({
               body: bulkRequest
           }, function(err, res) {
               if (err) {
                   console.err("Error inserting elasticsearch documents for sheet " + sheet.gid);
                   console.err(err);
               } else {
                   console.log("inserted documents for sheet " + sheet.gid);
               }
           });
       }
    });
});
