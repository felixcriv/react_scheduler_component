'use strict';

var AppDispatcher = require('../dispatchers/app-dispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/app-constants');
var assign = require('react/lib/Object.assign');

var CHANGE_EVENT = 'change';

var appointments = [];

var AppStore = assign({}, EventEmitter.prototype, {
	emitChange: function(){
		this.emit(CHANGE_EVENT);
	},

	addChangeListener: function(callback) {
    	this.on(CHANGE_EVENT, callback);
  	},

	createAppointment: function(data){
		console.log(data);
		appointments.push(data);
	},


	getAppointments: function(){
		return appointments;
	},

	editAppointment: function(){

	}
});

AppStore.dispatchToken = AppDispatcher.register(function(payload){

	var action = payload.action.actionType;

	console.log(action);

	switch(action) {
	
		case AppConstants.CREATE_APPOINTMENT:
				AppStore.createAppointment(payload.action.appointment);
				AppStore.emitChange();
				break;
		default:
	}

	return true;
});

module.exports = AppStore;