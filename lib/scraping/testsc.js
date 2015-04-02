var scrape = require('./scrapeSoundcloud');

var artistUrl = 'https://soundcloud.com/lindsay-lowend';
//var artistUrl = 'https://soundcloud.com/lindsay-lowend/june-17'

scrape(artistUrl, function(err, data) {
	if (err) {
		console.log(err);
	}
	console.dir(data);
});
