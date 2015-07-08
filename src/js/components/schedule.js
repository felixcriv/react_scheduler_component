'use strict';

var React = require('react');
var AppActions = require('../actions/app-actions');
var AppStore = require('../stores/app-store');


var Schedule = React.createClass({

	getInitialState: function(){

		return {
			appointments: AppStore.getAppointments(),
			showM: false
		}
	},

	componentDidMount: function(){
		
		AppStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
    	AppStore.removeChangeListener(this._onChange);
  	},

	_onChange: function() {
    	this.setState({appointments: AppStore.getAppointments()});
  	},

	handleClick: function(e){

	 this.setState({ showM: true });
	 this.props.showModal(this.showM);
	 var editingMode = false;

	 var patient = {};

	 var slot = e.hour+this.props.workingDays[e.day];

	 if(this.refs[slot].getDOMNode().children[0]){
	 	editingMode = true;
	 
	 	patient.name =  this.refs[slot].getDOMNode().children[0].children[0].innerHTML;
	 	patient.phone = this.refs[slot].getDOMNode().children[0].children[2].innerHTML;

	 	//this.props.update(e, patient, editingMode);
	 }
	 
	 this.props.update(e, patient, editingMode);
	},

	// shouldComponentUpdate: function(nextProps, nextState) {
 //  		return nextProps.id !== this.props.id;
	// },

	render: function(){

		var days = this.state.appointments[0];
		var patients = this.state.appointments[1];
      
		var _slots = function(id, h, handleClick){
			
			//react way to do this
			var daysforSlot = this.props.workingDays.map(function(day, i){
				//days with appointments
				var spanActive = Object.keys(days).map(function(appointment){
								
					            var _activeClass = null;
					            var _s = null;


					            if(day+h.hour === appointment){
					            	_activeClass = 'active'
					            }

					            if(_activeClass){
					            	_s = <span className='active'>{days[appointment]}
					            	<hr/>
					            	<p className='hideNumber'>
					            	{patients[days[appointment]]}
					            	</p></span>
					            }
								
								return (  {_s}  )
				}.bind(this));

				return (
					<td ref={h.hour+day} className='cell' onClick={handleClick.bind(null, {hour: h.hour, day:i})}>
						{spanActive}
					</td>
				)
		}.bind(this));

		
		return(
				{daysforSlot}
			)

		}.bind(this);

		//creates the working hours for the days and bind the click
		//handler to the hour slots
		var _schedule = this.props.workingHours.map(function(h, i){

			return (
					<tr key={i}>
					  <td>{h.text}</td>
					  {_slots(i, h, this.handleClick)}
					</tr>
				)
		}.bind(this));

		return(
			
			<span>
				{_schedule}
			</span>
		)
	}
});

module.exports = Schedule;