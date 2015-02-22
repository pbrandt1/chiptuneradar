var React = require('react');
var CreateModal = require('./CreateModal');

require('./submish.scss');


module.exports = React.createClass({
    componentDidMount: function() {
        // There's a couple seconds of delay before the
        // map loads, so we'll hide the compose button at first
        setTimeout(function() {
            document.getElementById('create-button').style.bottom = '15px';
        }, 4000);
    },
    render: function() {
        return <div>
            <div id="create-button">
                <img id="create-plus" src="/bt_speed_dial_2x.png"></img>
                <img id="create-pencil" src="/bt_compose2_2x.png"></img>
            </div>
            <CreateModal />
        </div>
    }
});