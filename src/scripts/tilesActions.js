let AppDispatcher = require('./AppDispatcher'),
	actionsConstants = require('./actionsConstants');

var tilesActions = {
	addTileDown: function(item){
    AppDispatcher.handleAction({
      actionType: actionsConstants.ADD_TILE_DOWN,
      data: item
    })
  },
  addTileUp: function(item){
    AppDispatcher.handleAction({
      actionType: actionsConstants.ADD_TILE_UP,
      data: item
    })
  },
  updateSomething: function(item){
    AppDispatcher.handleAction({
      actionType: actionsConstants.UPDATE_SOMETHING,
      data: item
    })
  }
};

module.exports = tilesActions;