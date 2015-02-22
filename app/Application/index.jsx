var React = require("react");
var StateFromStoreMixin = require("items-store/StateFromStoresMixin");
var RouteHandler = require("react-router").RouteHandler;
var Title = require('../Title');

require("./style.scss");

var Application = React.createClass({
	mixins: [StateFromStoreMixin],
	statics: {
		getState: function(stores, params) {
			var transition = stores.Router.getItem("transition");
			return {
				loading: !!transition
			};
		},
	},
	render: function() {
		return <div className="fill_parent">
                <Title />
                <RouteHandler />
            </div>;
	}
});
module.exports = Application;
