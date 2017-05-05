import React from 'react';
import _ from 'underscore';
import $ from 'jquery';
import {connect} from 'react-redux';

import Input from './FormComponents/Input.jsx';
import Checkbox from './FormComponents/Checkbox.jsx';

import * as actions from './actions';

class InnerProfile extends React.Component {
    constructor(props) {
        super(props);

        this.windowDefaults = {
            plot: false,
            draw: false,
            challengeBegin: false,
            attackersDeclared: true,
            defendersDeclared: true,
            winnerDetermined: false,
            dominance: false,
            standing: false
        };

        this.state = {
            disableGravatar: this.props.user.settings.disableGravatar || false,
            email: this.props.user ? this.props.user.email : '',
            loading: false,
            newPassword: '',
            newPasswordAgain: '',
            promptedActionWindows: this.props.user.promptedActionWindows || this.windowDefaults
        };

        this.windows = [
            { name: 'plot', label: 'Plots revealed' },
            { name: 'draw', label: 'Draw phase' },
            { name: 'challengeBegin', label: 'Challenge phase begins' },
            { name: 'attackersDeclared', label: 'Attackers declared' },
            { name: 'defendersDeclared', label: 'Defenders declared' },
            { name: 'winnerDetermined', label: 'Winner determined' },
            { name: 'dominance', label: 'Dominance phase' },
            { name: 'standing', label: 'Standing phase' }
        ];
    }

    componentWillReceiveProps(props) {
        this.setState({ email: props.user.email, disableGravatar: props.user.settings.disableGravatar || false, promptedActionWindows: props.user.promptedActionWindows || this.windowDefaults });
    }

    onChange(field, event) {
        var newState = {};

        newState[field] = event.target.value;
        this.setState(newState);
    }

    onWindowToggle(field, event) {
        var newState = {};
        newState.promptedActionWindows = this.state.promptedActionWindows;

        newState.promptedActionWindows[field] = event.target.checked;
        this.setState(newState);
    }

    onSaveClick(event) {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: undefined, successMessage: undefined });

        $.ajax('/api/account/' + this.props.user.username, 
            { 
                method: 'PUT',
                data: { data: JSON.stringify({
                    email: this.state.email,
                    password: this.state.newPassword,
                    promptedActionWindows: this.state.promptedActionWindows,
                    settings : {
                        disableGravatar: this.state.disableGravatar
                    }
                }) }
            })
            .done((data) => {
                if(data.success) {
                    this.setState({ successMessage: 'Profile saved successfully' });
                } else {
                    this.setState({ errorMessage: data.message });
                }
            })
            .always(() => {
                this.setState({ loading: false });
            });
    }

    render() {
        let windows = _.map(this.windows, window => {
            return (<Checkbox key={ window.name } name={ 'promptedActionWindows.' + window.name } label={ window.label } fieldClass='col-sm-offset-3 col-sm-4'
                type='checkbox' onChange={ (this.onWindowToggle.bind(this, window.name)) } checked={ this.state.promptedActionWindows[window.name] } />);             
        });

        return (
            <div>
                <h2>User profile for { this.props.user.username }</h2>
                { this.state.errorMessage ? <div className='alert alert-danger'>{ this.state.errorMessage }</div> : null }
                { this.state.successMessage ? <div className='alert alert-success'>{ this.state.successMessage }</div> : null }
                <form className='form form-horizontal'>
                    <h3>User details</h3>
                    <Input name='email' label='Email Address' labelClass='col-sm-3' fieldClass='col-sm-4' placeholder='Enter email address'
                        type='text' onChange={ this.onChange.bind(this, 'email') } value={ this.state.email } />
                    <Input name='newPassword' label='New Password' labelClass='col-sm-3' fieldClass='col-sm-4' placeholder='Enter new password'
                        type='password' onChange={ this.onChange.bind(this, 'newPassword') } value={ this.state.newPassword } />
                    <Input name='newPasswordAgain' label='New Password (again)' labelClass='col-sm-3' fieldClass='col-sm-4' placeholder='Enter new password (again)'
                        type='password' onChange={ this.onChange.bind(this, 'newPasswordAgain') } value={ this.state.newPasswordAgain } />
                    <Checkbox name='disableGravatar' label='Disable Gravatar integration' fieldClass='col-sm-offset-3 col-sm-4'
                        onChange={ (e) => this.setState({ disableGravatar: e.target.value }) } checked={ this.state.disableGravatar } />
                    <h3>Action window defaults</h3>
                    { windows }

                    <button className='btn btn-primary' type='button' disabled={ this.state.loading } onClick={ this.onSaveClick.bind(this) }>Save</button>
                </form>
            </div>);
    }
}

InnerProfile.displayName = 'Profile';
InnerProfile.propTypes = {
    user: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        user: state.auth.user
    };
}

const Profile = connect(mapStateToProps, actions)(InnerProfile);

export default Profile;
