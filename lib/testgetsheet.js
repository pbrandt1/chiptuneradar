var needle = require('needle');
var tsv = require('tsv');
var elasticsearch = require('elasticsearch');

var key = "14UH1hukA0486F7izROiLGpKnCRyoMJ6ze67GdQPAUeM"; // this is just my copy's key
var tsvLink = "https://docs.google.com/spreadsheets/d/KEY/export?format=tsv".replace("KEY", key);

var sheets = [
    {type: 'Chiptunes', gid: 0, columns: ['Artist', 'Location', 'Website', 'Website2']},
    {type: 'Visualist', gid: 3, columns: ['Artist', 'Location', 'Website', 'Website2']},
    {type: 'VGM', gid: 2, columns: ['Artist', 'Location', 'Website', 'Website2']},
    {type: 'Nerdcore', gid: 4, columns: ['Artist', 'Location', 'Website', 'Website2']},
    {type: 'Netlabel', gid: 7, columns: ['Artist', 'Location', 'Musical Focus', 'Website']}
];

// Transform a bunch of tsv docs to JSON and upsert them in elasticsearch
sheets.map(function(sheet) {
    var url = tsvLink + "&gid=" + sheet.gid;
    needle.get(url, function(err, res) {
       if (err) {
           console.log("Error fetching sheet " + sheet.gid);
           console.log(err);
       } else if (!res.body || res.body.length == 0) {
           console.log("No response for sheet " + sheet.gid);
       } else {
           console.log("got url " + url);
           var parser = new tsv.Parser('\t');
           var json = parser.parse(res.body);

           var esdocs = json.map(function(o) {
               return {
                   name: o['ARTIST NAME'] | 0['LABEL NAME'],
                   location_name: o['   LOCATION'],
                   type: sheet.type,
                   website: o['   WEBSITE'],
                   website2: o['3'],
                   musicalfocus: o['MUSICAL FOCUS'] | sheet.type
               }
           });
       }
    });
});