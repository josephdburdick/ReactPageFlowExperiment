let
  React = require('react'),
  Router = require('react-router'),
  Route = Router.Route,
  Link = Router.Link,
  DefaultRoute = Router.DefaultRoute,
  RouteHandler = Router.RouteHandler;

let MainContainer = React.createClass({
	render: function() {
		return (
			<div className="main-container">
				<div className="navigation-bar">
					Menu here.
				</div>
				<RouteHandler/>
			</div>
		);
	}
});

module.exports = MainContainer;