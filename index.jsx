var React = require('react');
var Map = require('./Map');
var Walkway = require('walkway.js');
var createArcadeGrid = require('./arcade-grid');

skel.init();

createArcadeGrid();

var svg = new Walkway({
    selector: '#arcade-grid',
    duration: '2000',
    // can pass in a function or a string like 'easeOutQuint'
    easing: function (t) {
        return t;
    }
});

setTimeout(function() {
    svg.draw(function() {
        console.log('eond');
        document.getElementById("arcade-overlay").style.height = "6em";
        var int = setInterval(createArcadeGrid, 1000/70); // OH GOD WHAT HAVE I DONE?
        setTimeout(function() {
            clearInterval(int);
        }, 2000)
    });
}, 1000);





React.render(<Map />, document.getElementById('content'));