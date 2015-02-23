var React = require("react");
var StateFromStoreMixin = require("items-store/StateFromStoresMixin");
var RouteHandler = require("react-router").RouteHandler;
var Title = require('../Title');
var Create = require('../Create');

require("./style.scss");
var skel = window.skel = require('../skel.min');
skel.init();

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
                <Create />
                <RouteHandler />
            </div>;
	}
});
module.exports = Application;
