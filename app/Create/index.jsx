var React = require('react');
var CreateModal = require('./CreateModal');

require('./submish.scss');


module.exports = React.createClass({
    getInitialState: function() {
        return {
            open: false
        };
    },
    componentDidMount: function() {
        // There's a couple seconds of delay before the
        // map loads, so we'll hide the compose button at first
        setTimeout(function() {
            document.getElementById('create-button').style.bottom = '15px';
        }, 4000);
    },
    openModal: function() {
        console.log('open the goddam modal');
        this.setState({open: true});
    },
    closeModal: function() {
        this.setState({open: false});
    },
    render: function() {
        return <div>
            <div id="create-button" onClick={this.openModal}>
                <img id="create-plus" src="/bt_speed_dial_2x.png"></img>
                <img id="create-pencil" src="/bt_compose2_2x.png"></img>
            </div>
            <CreateModal open={this.state.open}/>
        </div>
    }
});