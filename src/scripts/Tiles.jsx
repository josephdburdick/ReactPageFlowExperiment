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
		  jumpToContentIndex: null,
		  mappingContentToTile: [],
		  // scrollDetectionEnabled: true
		}
	},
	componentDidMount: function(){
		tilesStore.addChangeListener(this._onTilesDataChanged);
		tilesActions.addTileDown();
		this.currentRoute = this.props.location.pathname;
		this.scrollDetectionEnabled = true;
		console.log('enabling scroll detection.');
	},
	componentWillUnmount: function(){
		tilesStore.removeChangeListener(this._onTilesDataChanged);
	},
	componentDidUpdate: function() {
		if (!this.state.isInSensitiveZone_actionTaken) {
			if (this.state.isInSensitiveZone_up) {
				tilesActions.addTileUp();
			} else if (this.state.isInSensitiveZone_down) {
				tilesActions.addTileDown(this.state.jumpToContentIndex);
			}
		}

		if (this.props.location.pathname !== this.currentRoute) {
			console.log('route has changed. display the one tile content.');
			this.currentRoute = this.props.location.pathname;
			this.scrollDetectionEnabled = false;
			console.log('disabling scroll detection.');
			tilesActions.addFirstTile(this.props.location.pathname);
		}
	},
	_onTilesDataChanged: function(){
		let tilesList = this;
		if (tilesList.state.jumpToContentIndex !== null) {
			console.log('will now jump to #T'+ tilesStore.getTilesDownCount() + ' hosting #C' + tilesList.state.jumpToContentIndex);
		}
		console.log('tiles data change. update counts after/before to respectively ' + tilesStore.getTilesDownCount() + ', ' + tilesStore.getTilesUpCount());
		tilesList.setState({
		  countAfter: tilesStore.getTilesDownCount(),
		  countBefore: tilesStore.getTilesUpCount(),
		  mappingContentToTile: tilesStore.getContentToTilesMapping(),
		  'isInSensitiveZone_actionTaken': true
		});
	},
	_jumpToContentCTA: function(requestedContentIndex){
		let tilesList = this;
		console.log('Let\'s jump to #C' + requestedContentIndex);

		let contentAlreadyDisplayed = _.findWhere(tilesList.state.mappingContentToTile, {contentIndex: requestedContentIndex});

		if (contentAlreadyDisplayed != null) {
			console.log('existing content found. scrolling to host tile #T' + contentAlreadyDisplayed.tileIndex);
			// we need to trigger a state refresh so that the tile can highlight itself.
			tilesList.scrollDetectionEnabled = false;
			tilesList.setState({'jumpToContentIndex': requestedContentIndex});
		} else {
			console.log('content not found. adding a tile to host it.');
			tilesList.scrollDetectionEnabled = false;
			tilesList.setState({'isInSensitiveZone_down': true,
								'isInSensitiveZone_up': false,
								'isInSensitiveZone_actionTaken': false, 
								'jumpToContentIndex': requestedContentIndex});
		}
	},
	_reEnableScrollingDetection : function() {
		let tilesList = this;
		// delaying the effect, so that any undergoing scrolling can finish before
		// otherwise will add a new page because scrolling up enters the upper threshold
		window.setTimeout(
	      () => { 
	      	tilesList.scrollDetectionEnabled = true;
			console.log('enabling scroll detection.'); 
	      },
	      500
	    );
	},
	render: function() {
		let tilesList = this;
		const UPPER_THRESHOLD = 50;

		let tileIndexes = _.range(this.state.countBefore, this.state.countAfter + 1);

		let tileComponents = _.map(tileIndexes, currentTileIndex => (
			<Tile index={currentTileIndex} 
				  contentIndex={_.findWhere(tilesList.state.mappingContentToTile, {tileIndex: currentTileIndex}).contentIndex} 
				  minIndex={this.state.countBefore} 
				  maxIndex={this.state.countAfter} 
				  currentRoute={this.props.location.pathname} 
				  jumpToContentIndex={this.state.jumpToContentIndex} 
				  jumpToContentCTARef={this._jumpToContentCTA}
				  reEnableScrollingDetectionRef={this._reEnableScrollingDetection}/>));

		history.pushState(null, null, [window.location.origin, window.location.pathname, ['?from=', tileIndexes[0], '&to=', tileIndexes[tileIndexes.length -1]].join(''), window.location.hash].join(''));

		$(function($) {
	      let $appContainer = $('#app');

	      window.onscroll = function() {
	      	if (tilesList.scrollDetectionEnabled) {
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
		        							'isInSensitiveZone_up': false, 
		        							'isInSensitiveZone_actionTaken': false,
		        							'jumpToContentIndex': null});
		        	}
		        } 
		        else if(thisScrollTop < UPPER_THRESHOLD)
		        {
		        	if (!tilesList.state.isInSensitiveZone_up)
		        	{
		        		console.log("reaching beginning of page.");
		        		tilesList.setState({'isInSensitiveZone_up': true,
		        							'isInSensitiveZone_down': false,
		        							'isInSensitiveZone_actionTaken': false,
		        							'jumpToContentIndex': null});
		        	}
		        }
		        else
		        {
		        	console.log('on neutral grounds.');
		        	tilesList.setState({'isInSensitiveZone_up': false, 
		        						'isInSensitiveZone_down': false});
		        }
	      	} else {
	      		console.log('a tile is being accessed.');
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