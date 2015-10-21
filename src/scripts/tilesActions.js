let AppDispatcher = require('./AppDispatcher'),
	actionsConstants = require('./actionsConstants');

var tilesActions = {
	addTileDown: function(contentIndex){
    AppDispatcher.handleAction({
      actionType: actionsConstants.ADD_TILE_DOWN,
      data: contentIndex
    })
  },
  addTileUp: function(contentIndex){
    AppDispatcher.handleAction({
      actionType: actionsConstants.ADD_TILE_UP,
      data: contentIndex
    })
  },
  addFirstTile: function(contentIndex){
    AppDispatcher.handleAction({
      actionType: actionsConstants.ADD_FIRST_TILE,
      data: contentIndex
    });
  }
};

module.exports = tilesActions;