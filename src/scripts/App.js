let
  App = {};
  App.config = require('./config.js');
  App.views = {};

let
  React = require('react'),
  Router = require('react-router'),
  Route = Router.Route,
  Link = Router.Link,
  DefaultRoute = Router.DefaultRoute,
  RouteHandler = Router.RouteHandler;

App.views.MainContainer = require('./MainContainer.jsx');
App.views.Tiles = require('./Tiles.jsx');

let routes = (
  <Route path="/" handler={App.views.MainContainer}>
    <Route name="home" handler={App.views.Tiles}/>
    <DefaultRoute name="not-found" handler={App.views.Tiles}/>
  </Route>
);

Router.run(routes, Router.HashLocation, function (Handler) {
  React.render(<Handler/>, document.querySelector('#app'));
});
