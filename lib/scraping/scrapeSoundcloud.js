var needle = require('needle');
var rsvp = require('rsvp');
var soundcloudApiId = '4c5daba891ca143752c3f2cbf690d9f1';

var scrapeSoundcloud = module.exports = function(url, cb) {

	// This service resolves any soundcloud url that you just copy and paste
	// from the browser and gives you a soundcloud json api url to look up.
	var resolveUrl = "http://api.soundcloud.com/resolve.json?url=URL&client_id=SOUNDCLOUD_ID"
		.replace('URL', url)
		.replace('SOUNDCLOUD_ID', soundcloudApiId);
	
	needle.get(resolveUrl, function(err, res) {
		if (err) {
			console.error('Could not load url ' + resolveUrl);
			console.error(err);
			cb(err);
		}

		var body;
		if (typeof res.body === 'string') {
			try {
				body = JSON.parse(res.body);
			} catch (e) {
				console.error('Could not parse response from ' + resolveUrl);
				console.error(res.body);
				cb(e);
			}
		} else {
			body = res.body;
		}

		// get the resolved json api url
		if (!body.location) {
			cb(new Error("Could not resolve url " + url));
		}

		needle.get(body.location, function(err, res) {
			if (err) {
				console.error('Could not load user url ' + body.location);
				cb(err);
			}
			cb(null, res.body);
		})
	});
};
