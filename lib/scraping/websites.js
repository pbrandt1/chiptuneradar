/**
 * finds social media links from an array of strings.
 *
 * ex: websites(['http://soundcloud.com/grimecat', 'https://facebook.com/GR1MEKAT'])
 * returns { soundcloud: '...', facebook: '...'}
 *
 * assumes only one of each site
 *
 * @param string array of strings
 * @returns object websites found
 * @type {Function}
 */
var websites = module.exports = function(strings) {
    if (strings.reduce) {
        return strings.reduce(function(p, c) {
            if (typeof c !== 'string') {
                return p;
            }

            var cl = c.toLowerCase();  // lower case = best case

            if (cl.indexOf('soundcloud.com') >= 0) {
                p.soundcloud = makeHTTPS(c);
            } else if (cl.indexOf('facebook.com') >= 0) {
                p.facebook = makeHTTPS(c);
            } else if (cl.indexOf('twitter.com') >= 0) {
                p.twitter = makeHTTPS(c);
            } else if (cl.indexOf('bandcamp.com') >= 0) {
                p.bandcamp = makeHTTPS(c);
            } else if (cl.indexOf('youtube.com') >= 0) {
                p.youtube = makeHTTPS(c);
            } else if (cl.indexOf('tumblr.com') >= 0) {  // can they has musics?
                p.tumblr = makeHTTPS(c);
            } else if (cl.indexOf('wordpress.com') >= 0) { //rly? r u lame or what?
                p.wordpress = makeHTTPS(c);
            } else if (cl.indexOf('myspace.com') >=0 ) { //lol 2004 called and yeah
                p.myspace = makeHTTPS(c);
            } else if (cl.length > 3) { // just truuuuust it's their site :|
                p.personal = c;
            }

            return p;
        }, {});
    }

    return {};
};

/**
 * Turns a string from some randomly formatted url to an https:// url
 *
 * only handles:
 *  https://blah.com
 *  http://blah.com
 *  blah.com
 *
 * @param str
 */
function makeHTTPS(str) {
    if (str.indexOf('https://') == 0) {
        return str;
    } else if (str.indexOf('http://') == 0) {
        return 'https://' + str.substring(7, str.length);
    } else {
        return 'https://' + str;
    }
};