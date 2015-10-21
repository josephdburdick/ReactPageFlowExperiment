let
  React = require('react'),
  $ = require('jquery'),
  _ = require('underscore'),
  tilesStore = require('./tilesStore'),
  tilesActions = require('./tilesActions'),
  Tile = require('./Tile.jsx');

let Tiles = React.createClass({
	getInitialState: function(){
		return {
		  countAfter: tilesStore.getTilesDownCount(),
		  countBefore: tilesStore.getTilesUpCount(),
		  isInSensitiveZone: true //we're starting at the top of the page
		}
	},
	componentDidMount: function(){
		tilesStore.addChangeListener(this._onTilesChange);
	},
	componentWillUnmount: function(){
		tilesStore.removeChangeListener(this._onTilesChange);
	},
	_onTilesChange: function(){
		this.setState({
		  countAfter: tilesStore.getTilesDownCount(),
		  countBefore: tilesStore.getTilesUpCount()
		});
	},
	render: function() {
		let seq = _.range(this.state.countBefore, this.state.countAfter);
		let tiles = _.map(seq, number => <Tile index={number} minIndex={this.state.countBefore}/>);
		let tilesList = this;

		history.pushState(null, null, [window.location.origin, window.location.pathname, ['?from=', seq[0], '&to=', seq[seq.length -1]].join(''), window.location.hash].join(''));

		$(function($) {
	      let $appContainer = $('#app');
	      // window.scrollTo(0, 0);
	      window.onscroll = function() {
	        let thisScrollTop = Math.round($(this).scrollTop()),
	            thisInnerHeight = Math.round($(this).innerHeight()),
	            containeR = window,
	            containeD = document, //$('#footer-main'),
	            scrollPercent = 1 * $(containeR).scrollTop() / ($(containeD).height() - $(containeR).height());

	        if(thisScrollTop + thisInnerHeight + 1 >= $appContainer.outerHeight())
	        {
	        	if (!tilesList.state.isInSensitiveZone)
	        	{
	        		console.log("Reaching end of page.");
	        		tilesList.setState({'isInSensitiveZone': true});
	          		tilesActions.addTileDown();
	        	}
	        } 
	        else if(thisScrollTop < 50)
	        {
	        	if (!tilesList.state.isInSensitiveZone)
	        	{
	        		console.log("Reaching beginning of page.");
	        		tilesList.setState({'isInSensitiveZone': true});
	          		tilesActions.addTileUp();
	        	}
	        }
	        else
	        {
	        	tilesList.setState({'isInSensitiveZone': false});
	        }
	      };
	    });

		return (
			<div>
				{tiles}
			</div>
		);
	}
});

module.exports = Tiles;