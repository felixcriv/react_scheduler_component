'use strict';

var AppDispatcher = require('../dispatchers/app-dispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/app-constants');
var assign = require('react/lib/Object.assign');

var CHANGE_EVENT = 'change';

//mockup data

//day:patient
var appointments = {'Monday9':'nick', 
                    'Friday12':'kelly', 
                    'Wednesday15':'susan'};
// //name:number
var patients = {'susan': '555-555-1111',
                'kelly': '555-555-1114',
                'nick':'555-555-1112'};

// var appointments = {};
// var patients = {};

var AppStore = assign({}, EventEmitter.prototype, {

	emitChange: function(){
		this.emit(CHANGE_EVENT);
	},

	addChangeListener: function(callback) {
    	this.on(CHANGE_EVENT, callback);
  	},

  	removeChangeListener: function(callback) {
    	this.removeListener(CHANGE_EVENT, callback);
  	},

	createAppointment: function(data){
		var name = data.patient.name.toLowerCase();
		var dayHour = data.day+data.hour;
		var phone = data.patient.phone;
		//if patient no exists put new patient into patients and create an appointment for it
		if(!patients[name]){
			patients[name] = data.patient.phone;
			//if there is/there is not an appointment then update data

			appointments[dayHour] = name;
		 //patient exists, now compare phone #
		}else if(patients[name] !== phone){
			//create patient and appoint. for new patient
			patients[name] = data.patient.phone;
			appointments[dayHour] = name;
		}else{
			//create patient and appoint. for new patient
			appointments[dayHour] = name;
		}

		
		console.log(appointments);
	},

	getAppointments: function(){
		return [appointments, patients];
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