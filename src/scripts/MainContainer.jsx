import React from 'react'
import { Router, Route, Link } from 'react-router'

let MainContainer = React.createClass({
	render: function() {
		return (
			<div className="main-container">
				<div className="navigation-bar">
					Menu here. FYI, current route is "{this.props.location.pathname}"
				</div>
				{this.props.children || "Welcome to the site"}
			</div>
		);
	}
});

module.exports = MainContainer;