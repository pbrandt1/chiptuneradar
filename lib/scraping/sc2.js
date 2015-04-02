var needle = require('needle');
var db = require('../chipdb');
var async = require('async');

var soundcloudApiID = process.env.SOUNDCLOUD_ID;
soundcloudApiID = "4c5daba891ca143752c3f2cbf690d9f1";

// Get all the artists with "soundcloud.com" in their website
// Can just modify this to be website or website2 as you wish
db.Artist.find({soundcloud: /.+/}).exec({function(a) {
    // Find their soundcloud userId via the resolve endpoint https://developers.soundcloud.com/docs/api/reference#resolve
    async.map(a, function(o, cb) {
        var url = "http://api.soundcloud.com/resolve.json?url=URL&client_id=SOUNDCLOUD_ID"
            .replace('URL', o.soundcloud)
            .replace('SOUNDCLOUD_ID', soundcloudApiID);

        needle.get(url, function(err, res) {
            if (err) {
                console.error('Resolve failed for elasticsearch id: ' + o.id + ', artist ' + o._source.name);
                console.error(err);
            }

            var body;
            if (typeof res.body == 'string') {
                try {
                    body = JSON.parse(res.body);
                } catch (e) {
                    console.error('Could not parse body for elasticsearch id: ' + o.id + ', artist ' + o._source.name);
                    console.error('was:' + res.body);
                    return cb(null, o);
                }
            } else {
                body = res.body;
            }

            console.log(o.name);
            console.dir(body);

            if (body.location && body.location.match(/\d+/)) {
                o.soundcloudID = body.location.match(/\d+/)[0];
            }

            cb(null, o);
        });
    }, function(err, hits) {
        var bulkRequest = hits.reduce(function(p, c) {
            if (c.soundcloudID) {
                p.push({ update:  { _index: 'chiptunes', _type: 'artists', _id: c._id} });
                p.push({doc: {soundcloudID: c.soundcloudID}});
            }
            return p;
        }, []);

        client.bulk({
            body: bulkRequest
        }, function(err, res) {
            if (err) {
                console.error('bulk request failed');
                console.error(err);
            } else {
                console.log("updated");
            }
        });

    });

}, function (err) {
    console.trace(err.message);
});
