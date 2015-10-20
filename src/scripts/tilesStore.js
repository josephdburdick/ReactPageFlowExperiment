let React = require('react'),
    objectAssign = require('react/lib/Object.assign'),
    EventEmitter = require('events').EventEmitter,
    AppDispatcher = require('./AppDispatcher'),
    actionsConstants = require('./actionsConstants'),
    eventsConstants = require('./eventsConstants');

let _store = {
  list: [],
  count: 2,
  countBackwards: 0
};

let addTileDown = function(item) {
    _store.count++;
};

let addTileUp = function(item) {
    _store.countBackwards--;
};

let tilesStore = objectAssign({}, EventEmitter.prototype, {
  addChangeListener: function(cb){
    this.on(eventsConstants.CHANGE_EVENT, cb);
  },
  removeChangeListener: function(cb){
    this.removeListener(eventsConstants.CHANGE_EVENT, cb);
  },
  getTilesDownCount: function(){
    return _store.count;
  },
  getTilesUpCount: function(){
    return _store.countBackwards;
  }
});

AppDispatcher.register(function(payload)
{
  let action = payload.action;
  switch(action.actionType)
  {
    case actionsConstants.ADD_TILE_DOWN:
      addTileDown(action.data);
      tilesStore.emit(eventsConstants.CHANGE_EVENT);
    break;
    case actionsConstants.ADD_TILE_UP:
      addTileUp(action.data);
      tilesStore.emit(eventsConstants.CHANGE_EVENT);
    break;
    default:
      return true;
  }
});

module.exports = tilesStore;