'use strict';

var AppDispatcher = require('../dispatchers/app-dispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/app-constants');
var assign = require('react/lib/Object.assign');

var CHANGE_EVENT = 'change';

//mockup data
var appointments = [{day: 'Monday', hour: 9, 
					 patient:{name:'Ray', phone:'555-555-1111'}}, 
					 {day: 'Friday', hour: 12, 
					 patient:{name:'Kai', phone:'555-555-1114'}},
					 {day: 'Friday', hour: 14, 
					 patient:{name:'Oreo', phone:'555-555-1112'}}];

var AppStore = assign({}, EventEmitter.prototype, {

	emitChange: function(){
		console.log(CHANGE_EVENT);
		this.emit(CHANGE_EVENT);
	},

	addChangeListener: function(callback) {
    	this.on(CHANGE_EVENT, callback);
  	},

  	removeChangeListener: function(callback) {
    	this.removeListener(CHANGE_EVENT, callback);
  	},

	createAppointment: function(data){
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