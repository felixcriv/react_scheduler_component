'use strict';

var React = require('react');
var AppActions = require('../actions/app-actions');
var AppStore = require('../stores/app-store');
var Schedule = require('./schedule');

var Button = require('react-bootstrap/lib/Button');
var Modal = require('react-bootstrap/lib/Modal');
var Input = require('react-bootstrap/lib/Input');
var Table = require('react-bootstrap/lib/Table');


/*Renders a scheduler component based on user input appointments*/
var Scheduler = React.createClass({


	getInitialState: function(){
		return {

			//getting state from the store
			appointments: AppStore.getAppointments(),

			workingDays: AppStore.getWorkingDays(),

			workingHours: AppStore.getWorkingHours(),

			selectedDay: {},
			//working days for the schedule, we can use a store instead to get this data from
			//a web service

			patientName: '',
			patientNumber: '',
			shouldShowModal: false,
			/*validate form*/
			isValid : false,
			/*flag for user messages interaction*/
			isEditingMode: false
		}
	},

	componentWillMount: function(){

		React.initializeTouchEvents(true);
	},

	componentDidMount: function() {
    	AppStore.addChangeListener(this._onChange);
  	},

  	showModal: function(show){
  		
  		this.setState({shouldShowModal: show});
  	},

  	_onChange: function() {
    	this.setState(AppStore.getAppointments());
  	},

	closeModal: function(cb){
		 this.setState({shouldShowModal: false });
		 cb();
	},

	validationState: function(){
		// var length = this.state.patientNumber.length;
	 //    if (length >= 10) { return 'success'; }
	 //    else if (length > 5) { return 'warning'; }
	 //    else if (length > 0) { return 'error'; }
	},

	//clear modal and focus
	//https://facebook.github.io/react/docs/more-about-refs.html#completing-the-example
	clearInputs: function(){
		this.setState({patientName: ''});
		this.setState({patientNumber: ''});
		this.setState({ shouldShowModal: false });
	},

	
	resetModal: function(cb){
		cb();
	},

	update: function(e, patient, mode){

	 this.setState({patientName: patient.name});
	 this.setState({patientNumber: patient.phone});

	 this.setState({selectedDay: e});
	 this.setState({isEditingMode: mode});
	
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


	deleteAppointment: function(){
		AppActions.deleteAppointment({day: this.state.workingDays[this.state.selectedDay.day], 
									  hour: this.state.selectedDay.hour});

		this.closeModal(function(){});
	},


	patientNamehandleChange: function(e){
		this.setState({patientName : this.refs.patientName.getValue()});
	},

	patientNumberhandleChange: function(e){

		this.setState({patientNumber : this.refs.patientNumber.getValue()});
	},

	render: function(){

		//creates the header for the scheduler
		var _workingdays = this.state.workingDays.map(function(day, i){
			return(
				<th key={day}>{day}</th>
			);
		});

		var isEditingMode = this.state.isEditingMode;
		var status  = isEditingMode ? 'Save changes ' : 'Schedule appointment';
		var message = 'Please ' + (status === 'Save changes ' ? 'update ' : 'enter ') + 'your contact information';

		//http://react-bootstrap.github.io/components.html#input
		//Input and table react bootstrap component
		return(	
			<div className='container'>
				<div id='modal-wrapper'>
						<Modal show={this.state.shouldShowModal} onHide={this.closeModal.bind(null, this.clearInputs)} dialogClassName='modalStyle' ref='modalWindow'>
				          <Modal.Header closeButton>
				            <Modal.Title>{status === 'Save changes ' ? 'Update ' : 'Schedule '} your appointment on  
				            	{' ' + this.state.workingDays[this.state.selectedDay.day]} @  
				            	{' ' + this.state.selectedDay.hour > 12 ? (' ' + this.state.selectedDay.hour - 12) : this.state.selectedDay.hour}  
				            	{(this.state.selectedDay.hour < 12) ? 'A.M' : 'P.M'}
				            </Modal.Title>
				          </Modal.Header>
				          <Modal.Body>
				            <p>
				             {isEditingMode ? <label>Name</label> : ''}<Input
						        type='text'
						        value={this.state.patientName}
						        placeholder='Enter your name'
						        
						        ref='patientName'
						        groupClassName='group-class'
						        labelClassName='label-class'
						        onChange={this.patientNamehandleChange} />
						     {isEditingMode ? <label>Phone</label> : ''}<Input
						        type='phone'
						        value={this.state.patientNumber}
						        placeholder='Enter your phone number'
						        
						        bsStyle={this.validationState()}
						        ref='patientNumber'
						        groupClassName='group-class'
						        labelClassName='label-class' 
						        onChange={this.patientNumberhandleChange} />
				            </p>
				          </Modal.Body>
				            <Modal.Footer>
						    	<Button onClick={this.resetModal.bind(null, this.clearInputs)}>cancel</Button>
						    	{
						    		
						    		isEditingMode ?
						    		<Button onClick={this.deleteAppointment} bsStyle='danger'>delete</Button>
						    		: null

						    	}
						        <Button onClick={this.handleSaveClick} bsStyle='primary'>{status}</Button>
						    </Modal.Footer>
				        </Modal>
				</div>
				<div className='scheduler'>
					<Table striped responsive>
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