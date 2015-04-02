var scrape = require('./scrapeBIT');

var url = 'https://www.bandsintown.com/LindsayLowend';

scrape(url, function(err, data) {
	if (err) {
		console.error(err);
	}
	console.dir(data);
});
