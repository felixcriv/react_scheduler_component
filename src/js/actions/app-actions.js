'use strict';

var AppDispatcher = require('../dispatchers/app-dispatcher');
var AppConstants = require('../constants/app-constants');

var AppActions = {
	createAppointment: function(appointment){
		AppDispatcher.handleViewAction({
			actionType: AppConstants.CREATE_APPOINTMENT,
			appointment: appointment
		})
	},

	editAppointment: function(appointment){
		AppDispatcher.handleViewAction({
			actionType: AppConstants.EDIT_APPOINTMENT,
			appointment: appointment
		});
	}
}

module.exports = AppActions;