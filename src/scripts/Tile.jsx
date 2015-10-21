let
  React = require('react'),
  JumpButton = require('./JumpButton.jsx');

let Tile = React.createClass({
	componentWillUpdate: function() {
		if (this.props.jumpToContentIndex == null && this.props.index === this.props.minIndex) {
	  		this.shouldScroll = true;
	  		this.minIndexWas = this.props.minIndex;
	  		this.positionBackTo = $(window).scrollTop();
		}
	}, 
	componentDidMount: function() {
		if (this.props.contentIndex === this.props.jumpToContentIndex) {
			console.log('i am the new tile added at the bottom. scroll me to the top of the page.');
			let node = this.getDOMNode();
			$(window).scrollTop(node.offsetTop);
			this.shouldScroll = false;
			this.positionBackTo = null;
			this.props.jumpToContentDoneRef();
		}
	},
	componentDidUpdate: function() {
		if (this.shouldScroll && this.minIndexWas !== this.props.minIndex) {
			console.log('a new tile has been added above me. scroll back to me.');
			let node = this.getDOMNode();
			// TODO: the offsetHeight to use here is the height of the new tile above - not the current one
			let nodeAboveHeight = node.offsetHeight;
			$(window).scrollTop(this.positionBackTo + nodeAboveHeight);
			this.shouldScroll = false;
			this.positionBackTo = null;
			this.props.jumpToContentDoneRef();
		}
	},
	render: function() {
		let classNames = (this.props.index === this.props.minIndex?"content-tile first":(this.props.jumpToContentIndex === this.props.contentIndex?"content-tile jumped":"content-tile"));

		return (
			<div className={classNames}>
				<p>#T{this.props.index} : #C{this.props.contentIndex} Lorem Ipsum.</p>
				<JumpButton rangeContentMin={this.props.minIndex - 100} rangeContentMax={this.props.maxIndex + 100} jumpToContentCTARef={this.props.jumpToContentCTARef}/>
			</div>
		);
	}
});

module.exports = Tile;