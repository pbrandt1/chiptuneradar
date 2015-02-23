var React = require('react');

require('./modal.scss');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            open: !!this.props.open
        };
    },
    openModal: function() {
        this.setState({open: true});
    },
    closeModal: function() {
        this.setState({open: false});
    },
    render: function() {
        return (
            <div className={"modal-wrapper" + (this.state.open ? '' : " closed")}>
                <div id="create-modal-bg" onClick={this.closeModal}></div>
                <div id="create-modal-content" className="container">
                    <div className="12u modal-title">
                        Add Show
                    </div>
                    <div className="12u modal-content">
                        <a className="modal-close" href="#" onClick={this.closeModal}>x</a>
                        <div className="modal-form-element">
                            <label>Artist Name</label>
                            <input type="text" />
                        </div>
                        <div className="modal-form-element">
                            <label>Venue Name</label>
                            <input type="text" />
                        </div>
                        <div className="modal-form-element">
                            <label>Date</label>
                            <input type="date" />
                        </div>
                    </div>
                    <div className="12u modal-actions">
                        <div className="modal-button">Create</div>
                        <div className="modal-button">Cancel</div>
                    </div>
                </div>
            </div>)
    }
});