import React from 'react'
import { Router, Route, Link } from 'react-router'

let MainContainer = React.createClass({
	render: function() {
		let homeClassNames = (this.props.location.pathname === '/home'?'active-route':'');
		let workClassNames = (this.props.location.pathname === '/work'?'active-route':'');

		return (
			<div className="main-container">
				<div className="navigation-bar">
					<p>
			          <span className={homeClassNames}><Link to="/home">Home</Link></span> 
			          <span className={workClassNames}><Link to="/work">Work</Link></span>
			        </p>
				</div>
				{this.props.children || "Welcome to the site"}
			</div>
		);
	}
});

module.exports = MainContainer;