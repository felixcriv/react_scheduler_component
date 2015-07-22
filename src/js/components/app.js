'use strict';

var React = require('react');
var AppActions = require('../actions/app-actions');
var AppStore = require('../stores/app-store');
var Scheduler = require('./scheduler');

var App = React.createClass({
  render: function(){
    return (
      <div className="container">
        <h3>Schedule your appointment with Us</h3>
				<Scheduler />
			</div>
		)
	}
});

module.exports = App;
