var needle = require('needle');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});
var async = require('async');

var soundcloudApiID = process.env.SOUNDCLOUD_ID;

// Get all the artists with "soundcloud.com" in their website
// Can just modify this to be website or website2 as you wish
client.search({
    index: 'chiptunes',
    type: 'artists',
    body: {
        query: {
            wildcard: {
                website: '*soundcloud.com*'
            }
        }
    }
}).then(function (resp) {

    // Find their soundcloud userId via the resolve endpoint https://developers.soundcloud.com/docs/api/reference#resolve
    var hits = resp.hits.hits;
    async.map(hits, function(o, cb) {
        var url = "http://api.soundcloud.com/resolve.json?url=URL&client_id=SOUNDCLOUD_ID"
            .replace('URL', o._source.website)
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

            console.log(o._source.name);
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