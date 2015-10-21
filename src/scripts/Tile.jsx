let
  React = require('react');

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
			// node.scrollTop = 0;
			$(window).scrollTop(this.positionBackTo + node.offsetHeight);
			this.shouldScroll = false;
			this.positionBackTo = null;
		}
	},
	render: function() {
		let classNames = (this.props.index === this.props.minIndex?"content-tile first":"content-tile");

		return (
			<div className={classNames}>
				<p>{this.props.index} : Lorem Ipsum.</p>
			</div>
		);
	}
});

module.exports = Tile;