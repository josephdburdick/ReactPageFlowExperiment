let
  React = require('react'),
  JumpButton = require('./JumpButton.jsx');

let Tile = React.createClass({
	componentWillUpdate: function() {
		if (this.props.index === this.props.minIndex) {
	  		this.shouldScroll = true;
	  		this.minIndex = this.props.minIndex;
	  		this.positionBackTo = $(window).scrollTop();
		}
	}, 
	componentDidUpdate: function() {
		if (this.shouldScroll && this.minIndex !== this.props.minIndex) {
			var node = this.getDOMNode();
			// the offsetHeight to use here is the height of the new tile - not the current one
			$(window).scrollTop(this.positionBackTo + node.offsetHeight);
			this.shouldScroll = false;
			this.positionBackTo = null;
		}
	},
	render: function() {
		let classNames = (this.props.index === this.props.minIndex?"content-tile first":"content-tile");

		return (
			<div className={classNames}>
				<p>#T{this.props.index} : #C{this.props.contentIndex} Lorem Ipsum.</p>
				<JumpButton rangeContentMin={0} rangeContentMax={this.props.maxIndex + 100} jumpToContentCTARef={this.props.jumpToContentCTARef}/>
			</div>
		);
	}
});

module.exports = Tile;