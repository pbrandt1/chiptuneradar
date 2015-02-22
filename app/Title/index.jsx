var React = require("react");
require('./arcade.scss');
var Walkway = require('walkway.js');

var title = 'Chiptune\u0020Radar';

module.exports = React.createClass({
    getInitialState: function() {
        return {lines: [], viewBox: '0 0 0 0', shown: '', hidden: title}
    },
    recalculateLines: function() {
        var numberOfHorizontalLines = 11;
        var numberOfVerticalLines = 7;
        var width = document.getElementById("arcade-overlay").clientWidth,
            height = document.getElementById("arcade-overlay").clientHeight;
        var gridWidth = width/(numberOfVerticalLines - 1);
        var skinnyGridWidth = width/(numberOfVerticalLines + 1);
        var viewBox = '0 0 width height'.replace('width', width).replace('height', height);

        var lines = [];

        for (var i = 1; i <= numberOfHorizontalLines; i++) {
            var y = height - Math.log(i) / Math.log(numberOfHorizontalLines) * height;
            lines.push({
                x1: skinnyGridWidth - y / height * skinnyGridWidth,
                x2: width - skinnyGridWidth + y / height * skinnyGridWidth,
                y1: y,
                y2: y
            });
        }

        for (var i = 0; i < numberOfVerticalLines; i++) {
            lines.push({
                x1: (i + 1) * skinnyGridWidth,
                x2: i*gridWidth,
                y1: 0,
                y2: height
            });
        }

        this.setState({lines: lines, viewBox: viewBox});
    },
    componentDidMount: function() {
        var me = this;
        this.recalculateLines();

        var svg = new Walkway({
            selector: '#arcade-grid',
            duration: '2000',
            // can pass in a function or a string like 'easeOutQuint'
            easing: function (t) {
                return t;
            }
        });

        var n = 0;
        var interval = setInterval(function() {
            if (n == title.length) {
                return clearInterval(interval);
            }

            me.setState({
                shown: title.substring(0,n+1),
                hidden: title.substring(n+1,title.length)
            });

            n++;
        }, 200);

        setTimeout(function() {
            svg.draw(function() {
                document.getElementById("arcade-overlay").style.height = "6em";
                var int = setInterval(function() {
                    me.recalculateLines();
                }, 1000/70 ); // OH GOD WHAT HAVE I DONE?
                setTimeout(function() {
                    clearInterval(int);
                }, 2000)
            });
        }, 1000);
    },
    render: function() {
        return <div id="arcade-overlay">
            <h1 id="arcade-title">
                <div id="arcade-shown-title">{this.state.shown}</div>
                <div id="arcade-hidden-title">{this.state.hidden}</div>
            </h1>
            <svg id="arcade-grid" xmlns="http://www.w3.org/2000/svg" viewBox={this.state.viewBox}>
                <g>
                {this.state.lines.map(function(line) {
                        return <line y1={line.y1} y2={line.y2} x1={line.x1} x2={line.x2} stroke-width="1" stroke="#FFFFFF" fill="none" />
                    })}
                </g>
            </svg>
        </div>;
    }
});
