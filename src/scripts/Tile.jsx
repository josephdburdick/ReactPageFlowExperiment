let
  React = require('react');

let Tile = React.createClass({
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