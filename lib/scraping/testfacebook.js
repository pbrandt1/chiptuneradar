var needle = require('needle');

var data = '';
var newData = '';
var done = false;

needle.get('https://www.facebook.com/Grimecraft')
    .on('data', function(chunk) {
        if (!done) {
            data += chunk.toString();
            if (data.indexOf('soundcloud.com') >= 0) {
                done = true;
            }
        }
    }).on('end', function() {
        console.log(data);
        console.log('done!');
        var websites = ['soundcloud', 'twitter', 'bandcamp', 'youtube', 'tumblr'].reduce(function(p, site) {
            // [not whitespace or quote]url[not whitespace or quote]
            // www.soundcloud.com/grimecraft
            // www.grimecraft.bandcamp.com
            var re = new RegExp("([^\\s^\\\"]*" + site + ".com[^\\s^\\\"]*)");
            if (data.match(re)) {
                p[site] = data.match(re)[0];
            }
            return p;
        }, {});

        console.dir(websites);
    });