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
	 
	 var patient = {};

	 var slot = e.hour+this.props.workingDays[e.day];

	 if(this.refs[slot].getDOMNode().children[0]){
	 
	 	patient.name =  this.refs[slot].getDOMNode().children[0].children[0].innerHTML;
	 	patient.phone = this.refs[slot].getDOMNode().children[0].children[1].innerHTML;

	 	this.props.update(e, patient);
	 }
	 
	 this.props.update(e, patient);
	},

	// shouldComponentUpdate: function(nextProps, nextState) {
 //  		return nextProps.id !== this.props.id;
	// },

	render: function(){
      
		var _slots = function(id, h, handleClick){
			
			//react way to do this
			var daysforSlot = this.props.workingDays.map(function(day, i){
				
				var spanActive = this.state.appointments.map(function(appointment){
								
					            var _activeClass = null;
					            var _s = null;

					            if(h.hour+day === appointment.hour+appointment.day){
					            	_activeClass = 'active'
					            }

					            if(_activeClass){
					            	_s = <span className='active'>{appointment.patient.name}<p>
					            	{appointment.patient.phone}
					            	</p></span>
					            }
								
								
								return (  {_s}  )
				});

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