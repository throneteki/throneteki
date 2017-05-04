import React from 'react';
import _ from 'underscore';
import {connect} from 'react-redux';

import Input from './FormComponents/Input.jsx';

import * as actions from './actions';

class InnerProfile extends React.Component {
    constructor() {
        super();

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
            email: '',
            newPassword: '',
            newPasswordAgain: '',
            disableGravatar: false,
            promptedActionWindows: this.windowDefaults
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
        this.setState({ email: props.user.email, /*disableGravatar: props.user.settings.disableGravatar,*/ promptedActionWindows: props.user.promptedActionWindows || this.windowDefaults });
    }

    onChange(field, event) {
        this.setState({ field: event.target.value });
    }

    render() {
        let windows = _.map(this.windows, window => {
            return (<Input key={ window.name } name={ 'promptedActionWindows.' + window.name } label={ window.label } labelClass='col-sm-3' fieldClass='col-sm-4'
                type='checkbox' onChange={ this.onChange.bind(this, window.name) } value={ this.state.promptedActionWindows[window.name] } />);             
        });

        return ( 
            <div>
                <h2>User profile for { this.props.user.username }</h2>
                <form className='form form-horizontal'>
                    <h3>User details</h3>
                    <Input name='email' label='Email Address' labelClass='col-sm-3' fieldClass='col-sm-4' placeholder='Enter email address'
                        type='text' onChange={ this.onChange.bind(this, 'email') } value={ this.state.email } />
                    <Input name='newPassword' label='New Password' labelClass='col-sm-3' fieldClass='col-sm-4' placeholder='Enter new password'
                        type='password' onChange={ this.onChange.bind(this, 'newPassword') } value={ this.state.newPassword } />
                    <Input name='newPasswordAgain' label='New Password (again)' labelClass='col-sm-3' fieldClass='col-sm-4' placeholder='Enter new password (again)'
                        type='password' onChange={ this.onChange.bind(this, 'newPasswordAgain') } value={ this.state.newPasswordAgain } />
                    <Input name='settings.disableGravatar' label='Disable Gravatar integration' labelClass='col-sm-3' fieldClass='col-sm-4'
                        type='checkbox' onChange={ this.onChange.bind(this, 'disableGravatar') } value={ this.state.disableGravatar } />                                                
                    <h3>Action window defaults</h3>
                    { windows }

                    <button className='btn btn-primary' type='submit'>Save</button>
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
