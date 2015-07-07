'use strict';

var React = require('react');
var AppActions = require('../actions/app-actions');
var AppStore = require('../stores/app-store');

var ReactBootstrap = require('react-bootstrap');

var getAppointmentsFromStore = function () {
  return {
    appointments: AppStore.getAppointments()
  };
}

/*Renders a scheduler component based on user input appointments*/
var Scheduler = React.createClass({
	/*
		@workingDays	
	*/

	getInitialState: function(){
		return {

			appointments: getAppointmentsFromStore(),

			selectedDay: {},

			workingDays: ['Monday', 
						  'Tuesday', 
						  'Wednesday', 
						  'Thursday', 
						  'Friday'],

			workingHours: [	{hour:9,  text:'09:00 a.m'}, 
							{hour:10, text:'10:00 a.m'}, 
							{hour:11, text:'11:00 a.m'}, 
							{hour:12, text:'12:00 p.m'}, 
							{hour:13, text:'01:00 p.m'},
							{hour:14, text:'02:00 p.m'},
							{hour:15, text:'03:00 p.m'},
							{hour:16, text:'04:00 p.m'}],
			patientName: '',
			patientNumber: '',
			showModal: false,
			isValid : false
		}
	},

	componentDidMount: function() {
    	AppStore.addChangeListener(this._onChange);
    	console.log(this.state.appointments);
  	},

  	_onChange: function() {
  		console.log(this.state.appointments);
    	this.setState(getAppointmentsFromStore());
  	},

	closeModal: function(cb){
		 this.setState({ showModal: false });
		 cb();
	},

	//clear modal and focus
	//https://facebook.github.io/react/docs/more-about-refs.html#completing-the-example
	clearInputs: function(){
		this.setState({patientName: ''});
		this.setState({patientNumber: ''});
	},

	
	resetModal: function(cb){
		cb();
	},

	handleClick: function(e){
	 
	 var node = React.findDOMNode(this.refs[e.hour]);
	 //console.log(node.childNodes[e.day]);
	 this.setState({selectedDay: e});
	 this.setState({ showModal: true });
	},

	handleSaveClick: function(){
		AppActions.createAppointment({details: this.state.selectedDay, 
			patientInfo: {	name: this.state.patientName,
			 				phone: this.state.patientNumber
			}
		});

		this.resetModal(this.closeModal.bind(null, this.clearInputs));
	},

	patientNamehandleChange: function(){
		this.setState({patientName : this.refs.patientName.getValue()});
	},

	patientNumberhandleChange: function(){
		this.setState({patientNumber : this.refs.patientNumber.getValue()});

		// if(this.state.patientName.length > 4 && this.state.patientNumber.length > 7){
		// 	this.setState({isValid : true});
		// }else{
		// 	this.setState({isValid : false});
		// }
		
	},

	render: function(){

		var Table = ReactBootstrap.Table;
		var Modal = ReactBootstrap.Modal;
		var Input = ReactBootstrap.Input;
		var Button = ReactBootstrap.Button;

		//creates the header for the scheduler
		var _workingdays = this.state.workingDays.map(function(day, i){
			return(
				<th>{day}</th>
			);
		});

		//creates the schedule slots for the days
		var _slots = function(id, h, handleClick){

			//react way to do this
			var daysforSlot = this.state.workingDays.map(function(day, i){
				return (
					<td id={i} onClick={handleClick.bind(null, {hour: h.hour, day:i})}></td>
				)
			});

				// <td id='1' onClick={handleClick.bind(null, {hour: h.hour, day:1})}></td>
				// <td id='2' onClick={handleClick.bind(null, {hour: h.hour, day:2})}></td>
			    //<td id='3' onClick={handleClick.bind(null, {hour: h.hour, day:3})}></td>
				// <td id='4' onClick={handleClick.bind(null, {hour: h.hour, day:4})}></td>
				// <td id='5' onClick={handleClick.bind(null, {hour: h.hour, day:5})}></td>

			return(
				<span>
					<td>{h.text}</td>
					{daysforSlot}
				</span>
			)

		}.bind(this);

		//creates the working hours for the days and bind the click
		//handler to the schedule slots
		var _schedule = this.state.workingHours.map(function(h, i){
			return (
					<tr key={i} ref={h.hour}>
					  {_slots(i, h, this.handleClick)}
					</tr>
				)
		}.bind(this));

		return(
					<div className='container'>
					<div id='modal-wrapper'>
							<Modal show={this.state.showModal} onHide={this.closeModal} dialogClassName='modalStyle'>
					          <Modal.Header closeButton>
					            <Modal.Title>Schedule your appointment on  
					            	{' ' + this.state.workingDays[this.state.selectedDay.day -1]} @  
					            	{' ' + this.state.selectedDay.hour > 12 ? (' ' + this.state.selectedDay.hour - 12) : this.state.selectedDay.hour}  
					            	{(this.state.selectedDay.hour < 12) ? 'A.M' : 'P.M'}
					            </Modal.Title>
					          </Modal.Header>
					          <Modal.Body>
					            <p>
					             <Input
							        type='text'
							        value={this.state.patientName}
							        placeholder='Enter your name'
							        label='Please enter your contact information'
					  
							        hasFeedback
							        ref='patientName'
							        groupClassName='group-class'
							        labelClassName='label-class'
							        onChange={this.patientNamehandleChange} />
							     <Input
							        type='text'
							        value={this.state.patientNumber}
							        placeholder='Enter your phone number'
							        hasFeedback
							        ref='patientNumber'
							        groupClassName='group-class'
							        labelClassName='label-class' 
							        onChange={this.patientNumberhandleChange} />
					            </p>
					          </Modal.Body>
					           <Modal.Footer>
							    	<Button onClick={this.resetModal.bind(null, this.clearInputs)}>cancel</Button>
							        <Button onClick={this.handleSaveClick} bsStyle='primary' disabled={this.state.isValid} ref="makeAppointmentButtonHandler">Make Appointment</Button>
							    </Modal.Footer>
					        </Modal>
					</div>
					<div className='scheduler'>
						<Table striped>
						  <thead>
						    <tr>
						      <th>Hours</th>
						      {_workingdays}
						    </tr>
						  </thead>
						  <tbody>
						    {_schedule}
						  </tbody>
						</Table>
					</div>
			</div>
		)
	}
});

module.exports = Scheduler;