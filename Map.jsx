var React = require('react');
var Leaflet = require('leaflet');
var L = Leaflet;

var shows = require('./showService');

// http://stackoverflow.com/a/26762020
module.exports = React.createClass({
    displayName: 'Map',
    componentDidMount: function() {
        // Toner is the best.
        var TonerLayer = new L.StamenTileLayer("toner");

        //var CartoDB_DarkMatter = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
        //    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
        //    subdomains: 'abcd',
        //    minZoom: 0,
        //    maxZoom: 18
        //});

        //var OSM = L.tileLayer(
        //    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        //    {attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'})

        var map = this.map = Leaflet.map(this.getDOMNode(), {
            minZoom: 2,
            maxZoom: 20,
            layers: [
                TonerLayer
            ],
            attributionControl: false
        });

        // Add the shows
        shows.find().map(function(show) {
            L.marker(show.location).addTo(map).bindPopup(show.artist + ' at ' + show.venue + '<br />' + show.time);
        });

        // Location, location, location
        map.locate({setView: true, maxZoom: 16});

        function onLocationFound(e) {
            L.circle(e.latlng, 10).addTo(map).bindPopup('My Location');
        }

        function onLocationError(e) {
            map.setView([38.896217, -77.010749], 13);
        }

        map.on('locationfound', onLocationFound);
        map.on('locationerror', onLocationError);
        map.on('click', this.onMapClick);
    },
    componentWillUnmount: function() {
        this.map.off('click', this.onMapClick);
        this.map = null;
    },
    onMapClick: function() {
        // Do some wonderful map things...
    },
    render: function(){
        return <div className="map"></div>
    }
});
