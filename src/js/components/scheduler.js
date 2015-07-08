'use strict';

var React = require('react');

var AppActions = require('../actions/app-actions');

var AppStore = require('../stores/app-store');

var Schedule = require('./schedule');


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
  	},

  	showModal: function(show){
  		this.setState({showModal: show});
  	},

  	_onChange: function() {
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
		this.setState({ showModal: false });
	},

	
	resetModal: function(cb){
		cb();
	},

	update: function(e){

	 this.setState({selectedDay: e});
	
	},

	handleSaveClick: function(){
		
		AppActions.createAppointment({day: this.state.workingDays[this.state.selectedDay.day], 
									  hour: this.state.selectedDay.hour, 
									  patient: {name: this.state.patientName,
										 		phone: this.state.patientNumber
									}
		});

		this.resetModal(this.closeModal.bind(null, this.clearInputs));
	},

	patientNamehandleChange: function(e){
		this.setState({patientName : this.refs.patientName.getValue()});
	},

	patientNumberhandleChange: function(e){

		this.setState({patientNumber : this.refs.patientNumber.getValue()});
	},

	render: function(){

		var Table = ReactBootstrap.Table;
		var Modal = ReactBootstrap.Modal;
		var Input = ReactBootstrap.Input;
		var Button = ReactBootstrap.Button;

		//creates the header for the scheduler
		var _workingdays = this.state.workingDays.map(function(day, i){
			return(
				<th key={day}>{day}</th>
			);
		});

		return(
					<div className='container'>
					<div id='modal-wrapper'>
							<Modal show={this.state.showModal} onHide={this.closeModal} dialogClassName='modalStyle'>
					          <Modal.Header closeButton>
					            <Modal.Title>Schedule your appointment on  
					            	{' ' + this.state.workingDays[this.state.selectedDay.day]} @  
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
							        <Button onClick={this.handleSaveClick} bsStyle='primary'>Make Appointment</Button>
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
						    <Schedule showModal={this.showModal} 
						    		  update={this.update} 
						    		  workingDays={this.state.workingDays} 
						    		  workingHours={this.state.workingHours}
						    />
						  </tbody>
						</Table>
					</div>
			</div>
		)
	}
});

module.exports = Scheduler;