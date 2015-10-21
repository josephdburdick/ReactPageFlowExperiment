let
  React = require('react'),
  _ = require('underscore');

var JumpButton = React.createClass({
  getInitialState: function(){
    return {
      jumpToContentIndex: _.random(this.props.rangeContentMin, this.props.rangeContentMax)
    }
  },
  handleClick: function(event) {
    this.props.jumpToContentCTARef(this.state.jumpToContentIndex);
  },
  render: function() {
    return (
      <p className="jump-to-btn" onClick={this.handleClick}>
        Jump to tile #C{this.state.jumpToContentIndex}
      </p>
    );
  }
});

module.exports = JumpButton;