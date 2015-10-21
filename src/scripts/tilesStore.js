let React = require('react'),
    _ = require('underscore'),
    objectAssign = require('react/lib/Object.assign'),
    EventEmitter = require('events').EventEmitter,
    AppDispatcher = require('./AppDispatcher'),
    actionsConstants = require('./actionsConstants'),
    eventsConstants = require('./eventsConstants');

let _store = {
  contentToTileMapping: [],
  maxTileIndex: -1,
  minTileIndex: 0,
  defaultContentIndex: 0
};

let addTileDown = function(contentIndex) {
    let associatedContentIndex;
    _store.maxTileIndex++;

    if (contentIndex == null){
      let contentIndexNotRenderedYet = false;

      while(!contentIndexNotRenderedYet) {
        _store.defaultContentIndex++;
        if (_.findWhere(_store.contentToTileMapping, {contentIndex: _store.defaultContentIndex}) == null) {
          contentIndexNotRenderedYet = true;
        }
      }

      associatedContentIndex = _store.defaultContentIndex;   
    } else {
      associatedContentIndex = contentIndex;
    }

    console.log('retrieving data for #C' + associatedContentIndex);
    _store.contentToTileMapping.push({tileIndex: _store.maxTileIndex, contentIndex: associatedContentIndex});
};

let addTileUp = function(contentIndex) {
    let associatedContentIndex;
    _store.minTileIndex--;

    if (contentIndex == null){
      let contentIndexNotRenderedYet = false;

      while(!contentIndexNotRenderedYet) {
        _store.defaultContentIndex--;
        if (_.findWhere(_store.contentToTileMapping, {contentIndex: _store.defaultContentIndex}) == null) {
          contentIndexNotRenderedYet = true;
        }
      }

      associatedContentIndex = _store.defaultContentIndex;   
    } else {
      associatedContentIndex = contentIndex;
    }

    console.log('retrieving data for #C' + associatedContentIndex);
    _store.contentToTileMapping.push({tileIndex: _store.minTileIndex, contentIndex: associatedContentIndex});
};

let tilesStore = objectAssign({}, EventEmitter.prototype, {
  addChangeListener: function(cb){
    this.on(eventsConstants.CHANGE_EVENT, cb);
  },
  removeChangeListener: function(cb){
    this.removeListener(eventsConstants.CHANGE_EVENT, cb);
  },
  getTilesDownCount: function(){
    return _store.maxTileIndex;
  },
  getTilesUpCount: function(){
    return _store.minTileIndex;
  },
  getContentToTilesMapping: function(){
    return _store.contentToTileMapping;
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