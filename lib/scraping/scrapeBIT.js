var needle = require('needle');

var appID = "chiptuneradar";

var rootURL = "https://www.bandsintown.com/";

// turns https://www.bandsintown.com/LindsayLowend/events/asfdasf
// to LindsayLowend
var getArtistNameFromUrl = function(url) {
	url = url.replace(/\./g, '/');
	var lowerUrl = url.toLowerCase();
	var urlParts = url.split('/');
	var lowerUrlParts = lowerUrl.split('/');
	var baseIndex = lowerUrlParts.indexOf('bandsintown') + 1;
	return urlParts[baseIndex + 1];
};

// scrapes BandsInTown
var scrapeBIT = module.exports = function(url, cb) {
	var artist = getArtistNameFromUrl(url);

	if (!artist) {
		console.error("Could not get BIT artist from " + url);
		return cb(new Error("Could not get BIT artist from url '" + url + "'"));
	}

	var bitURL = "http://api.bandsintown.com/artists/" + artist 
		+ "/events.json?api_version=2.0&app_id=" + appID;

	needle.get(bitURL, function(err, res) {
		if (err) {
			cb(err);
			return console.error(err);
		}

		cb(null, res.body);

	});

};
