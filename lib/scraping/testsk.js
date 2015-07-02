var scrape = require('./testSongkick');

throw new Error("Songkick's terms of service suck giant donkey dick");

var url = 'https://www.songkick.com/artists/7214759-lindsay-lowend';

scrape(url, function(err, data) {
	if (err) {
		console.error(err);
	}

	console.dir(data);
});
