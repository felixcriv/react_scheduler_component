var AppDispatcher = require('../dispatchers/app-dispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/app-constants');
var assign = require('react/lib/Object.assign');

var CHANGE_EVENT = 'change';

var AppStore = assign({}, EventEmitter.prototype, {
	emitChange: function(){
		this.emit(CHANGE_EVENT);
	}
});

AppDispatcher.register(function(payload){
	console.log(payload);
	//resolve the promise
	return true;
});

module.exports = AppStore;