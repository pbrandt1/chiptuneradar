var needle = require('needle');
var trumpet = require('trumpet');
var db = require('../chipdb');
var async = require('async');
var extend = require('extend');

// for facebook pages, we just need to get the meta description tag, which hold the related social media tags

// get all the facebooks
db.Artist.find()
    .exists('facebook')
    .exec().then(function(res) {
        console.log('got all the facebook artists, length ' + res.length);
    var hits = res; // so many hits.  hits upon hits.

    // now spam the shit out of facebook to scrape the social media tags from their metas
    async.map(hits, function(o, cb) {

        // go slowly
        (function() {

            // yay debug info!
            console.log('processing ' + o._source.name);

            // create a string that is everything up to <body> aka the header
            var data = '';
            var done = false;

            // get the all the html code from <html> to <body>, so basically the <head>
            needle.get(o._source.websites.facebook)
                .on('data', function(chunk) {
                    if (!done) {
                        data += chunk.toString();
                        if (data.indexOf('<body') >= 0) {
                            done = true;
                        }
                    }
                }).on('end', function() {
                    // grep the social stuff from the <meta description> tag
                    // turn <meta>www.soundcloud.com/grimecraft www.twitter.com/grimecraft</meta>
                    // into {soundcloud: www.soundcloud.com/grimecraft, twitter: www.twitter.com/grimecraft}
                    // Definitely the hardest part of the code to read... especially when drinking
                    o.newWebsites = ['soundcloud', 'twitter', 'bandcamp', 'youtube', 'tumblr'].reduce(function(p, site) {
                        // here's the format of what I expect:
                        // <meta blah>www.soundcloud.com/artist www.twitter.com/artist www.poop.com/artist</meta>
                        // so we've got {shit}www.soundcloud/artist{shit}
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

        hits.map(function(c) {
            if (Object.keys(c.newWebsites).length > 0) {
                db.Artist.where({_id: c._id}).update(c.newWebsites, function(err) {
                    if (err) {
                        console.error('error updating document ' + c._id + " with new websites" + c.newWebsites);
                        console.error(err);
                    }
                });
            }

            console.log('updated');
        });
    });
});