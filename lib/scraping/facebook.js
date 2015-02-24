var needle = require('needle');
var trumpet = require('trumpet');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});
var Bottleneck = require('bottleneck');
var limiter = new Bottleneck(10, 500); // ten requests at a time, 500 ms between each request
var async = require('async');
var extend = require('extend');

// for facebook pages, we just need to get the meta description tag, which hold the related social media tags

// get all the facebooks
client.search({
    index: 'chiptunes',
    type: 'artists',
    body: {
        query: {
            match_all: {}
        },
        filter: {
            exists: {
                field: 'websites.facebook'
            }
        },
        size: 10000
    }
}).then(function(res) {
    var hits = res.hits.hits; // so many hits.  hits upon hits.

    // now spam the shit out of facebook to scrape the social media tags from their metas
    async.map(hits, function(o, cb) {

        // go slowly
        (function() {

            // yay debug info!
            console.log('processing ' + o._source.name);

            // create a string that is everything up to <body> aka the header
            var data = '';
            var done = false;

            needle.get(o._source.websites.facebook)
                .on('data', function(chunk) {
                    if (!done) {
                        data += chunk.toString();
                        if (data.indexOf('<body') >= 0) {
                            done = true;
                        }
                    }
                }).on('end', function() {
                    //console.log(data);
                    o.newWebsites = ['soundcloud', 'twitter', 'bandcamp', 'youtube', 'tumblr'].reduce(function(p, site) {
                        // [not whitespace or quote]url[not whitespace or quote]
                        // www.soundcloud.com/grimecraft
                        // www.grimecraft.bandcamp.com
                        var re = new RegExp("([^\\s^\\\"]*" + site + ".com[^\\s^\\\"]*)");
                        if (data.match(re)) {
                            p[site] = data.match(re)[0];
                        }
                        return p;
                    }, {});

                    console.log(o._source.name);
                    console.dir(o.newWebsites);

                    cb(null, o);
                }).on('error', function(err) {
                    console.error(err);
                    cb(null, o);
                })
        })(); //, function() {/*yeah, idk */})();
    }, function(err, hits) {
        if (err) {
            console.error('error spamming facebook');
            console.error(err);
        }

        var bulkUpdates = hits.reduce(function(p, c) {
            if (Object.keys(c.newWebsites).length > 0) {
                p.push({ update:  { _index: 'chiptunes', _type: 'artists', _id: c._id} });
                p.push({doc: {websites: c.newWebsites}});
            }
            return p;
        }, []);

        console.dir(bulkUpdates);

        client.bulk({
            body: bulkUpdates
        }, function(err, res) {
            if (err) {
                console.error('bulk request failed');
                console.error(err);
            } else {
                console.log("updated");
            }
        });
    });
});