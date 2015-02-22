var React = require('react');
var Leaflet = require('leaflet');
var L = Leaflet;


// http://stackoverflow.com/a/26762020
module.exports = React.createClass({
    displayName: 'Pin',
    componentDidMount: function() {
    },
    componentWillUnmount: function() {
        this.map.off('click', this.onMapClick);
        this.map = null;
    },
    onMapClick: function() {
    },
    render: function(){
        return <div className="pin"></div>
    }
});
