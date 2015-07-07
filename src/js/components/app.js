'use strict';

var React = require('react');
var AppActions = require('../actions/app-actions');
var AppStore = require('../stores/app-store');
var Scheduler = require('./scheduler');

var App = React.createClass({

	render: function(){
		return (

			<div className="container">
				<h3>Appointment Scheduler</h3>
				<Scheduler />
			</div>
		)
	}
});

module.exports = App;