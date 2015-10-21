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
		  //we're starting at the top of the page
		  isInSensitiveZone_up: true,
		  isInSensitiveZone_down: false,
		  // we cannot both update the state and take action - otherwise the state used after the action will not be refreshed to what we expect
		  isInSensitiveZone_actionTaken: true,
		  jumpToContentIndex: null
		}
	},
	componentDidMount: function(){
		tilesStore.addChangeListener(this._onTilesDataChanged);
	},
	componentWillUnmount: function(){
		tilesStore.removeChangeListener(this._onTilesDataChanged);
	},
	componentDidUpdate: function() {
		if (!this.state.isInSensitiveZone_actionTaken) {
			if (this.state.isInSensitiveZone_up) {
				tilesActions.addTileUp();
			} else if (this.state.isInSensitiveZone_down) {
				tilesActions.addTileDown();
			}
		}
	},
	_onTilesDataChanged: function(){
		let tilesList = this;
		tilesList.setState({
		  countAfter: tilesStore.getTilesDownCount(),
		  countBefore: tilesStore.getTilesUpCount(),
		  'isInSensitiveZone_actionTaken': true
		});

		if (tilesList.state.jumpToContentIndex !== null) {
			console.log('will now jump to #T'+ tilesList.state.countAfter + ' hosting #C' + tilesList.state.jumpToContentIndex);
			tilesList.setState({'jumpToContentIndex': null});
		}
	},
	_jumpToContentCTA: function(contentIndex){
		let tilesList = this;
		console.log('Let\'s jump to #C' + contentIndex);

		let contentAlreadyDisplayed = false;

		if (contentAlreadyDisplayed) {
			console.log('existing content found. scrolling to host tile.');
		} else {
			console.log('content not found. adding a tile to host it.');
			tilesList.setState({'isInSensitiveZone_down': true,
								'isInSensitiveZone_actionTaken': false, 
								'jumpToContentIndex': contentIndex});
		}
	},
	render: function() {
		let tilesList = this;
		const UPPER_THRESHOLD = 50;
		let tileIndexes = _.range(this.state.countBefore, this.state.countAfter);
		let tileComponents = _.map(tileIndexes, tileIndex => <Tile index={tileIndex} contentIndex={tileIndex} minIndex={this.state.countBefore} maxIndex={this.state.countAfter} jumpToContentCTARef={this._jumpToContentCTA}/>);

		history.pushState(null, null, [window.location.origin, window.location.pathname, ['?from=', tileIndexes[0], '&to=', tileIndexes[tileIndexes.length -1]].join(''), window.location.hash].join(''));

		$(function($) {
	      let $appContainer = $('#app');

	      window.onscroll = function() {
	        let thisScrollTop = Math.round($(this).scrollTop()),
	            thisInnerHeight = Math.round($(this).innerHeight()),
	            containeR = window,
	            containeD = document,
	            scrollPercent = 1 * $(containeR).scrollTop() / ($(containeD).height() - $(containeR).height());

	        let lower_threshold = thisScrollTop + thisInnerHeight + 1;
	        if(lower_threshold >= $appContainer.outerHeight())
	        {
	        	if (!tilesList.state.isInSensitiveZone_down)
	        	{
	        		console.log("reaching end of page.");
	        		tilesList.setState({'isInSensitiveZone_down': true, 
	        							'isInSensitiveZone_actionTaken': false});
	        	}
	        } 
	        else if(thisScrollTop < UPPER_THRESHOLD)
	        {
	        	if (!tilesList.state.isInSensitiveZone_up)
	        	{
	        		console.log("reaching beginning of page.");
	        		tilesList.setState({'isInSensitiveZone_up': true, 
	        							'isInSensitiveZone_actionTaken': false});
	        	}
	        }
	        else
	        {
	        	console.log('on neutral grounds.');
	        	tilesList.setState({'isInSensitiveZone_up': false, 
	        						'isInSensitiveZone_down': false});
	        }
	      };
	    });

		return (
			<div>
				{tileComponents}
			</div>
		);
	}
});

module.exports = Tiles;