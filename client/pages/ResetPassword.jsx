import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import $ from 'jquery';

import {connect} from 'react-redux';
import AlertPanel from '../SiteComponents/AlertPanel.jsx';
import Input from '../FormComponents/Input';

import * as actions from '../actions';
import formFields from './formFields.json';

class ResetPassword extends React.Component {
    constructor() {
        super();

        this.state = {
            password: '',
            password1: ''
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(field, event) {
        var newState = {};

        newState[field] = event.target.value;
        this.setState(newState);
    }

    onSubmit(event) {
        event.preventDefault();

        $.ajax({
            url: '/api/account/password-reset-finish',
            type: 'POST',
            data: JSON.stringify({ id: this.props.id, token: this.props.token, newPassword: this.state.password }),
            contentType: 'application/json'
        }).done((data) => {
            if(!data.success) {
                this.setState({ error: data.message });
                return;
            }

            this.props.navigate('/login');
        }).fail(() => {
            this.setState({ error: 'Could not communicate with the server.  Please try again later.' });
        });
    }

    render() {
        if(!this.props.id || !this.props.token) {
            return <AlertPanel type='error' message='This page is not intended to be viewed directly.  Please click on the link in your email to reset your password' />;
        }

        const fieldsToRender = formFields.resetpassword.map(field => {
            return (<Input key={ field.name } name={ field.name } label={ field.label } placeholder={ field.placeholder }
                validationAttributes={ field.validationProperties } fieldClass={ field.fieldClass } labelClass={ field.labelClass }
                type={ field.inputType } onChange={ this.onChange.bind(this, field.name) } value={ this.state[field.name] } />);
        });

        let errorBar = this.props.apiSuccess === false ? <AlertPanel type='error' message={ this.props.apiMessage } /> : null;

        return (
            <div>
                { errorBar }
                <div className='panel-title'>
                    Reset password
                </div>
                <div className='panel'>
                    <form className='form form-horizontal'>
                        { fieldsToRender }
                        <div className='form-group'>
                            <div className='col-sm-offset-2 col-sm-3'>
                                <button ref='submit' type='submit' className='btn btn-primary' onClick={ this.onLogin } disabled={ this.props.apiLoading }>
                                    Submit { this.props.apiLoading ? <span className='spinner button-spinner' /> : null }
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>);
    }
}

ResetPassword.propTypes = {
    apiLoading: PropTypes.bool,
    apiMessage: PropTypes.string,
    apiSuccess: PropTypes.bool,
    id: PropTypes.string,
    navigate: PropTypes.func,
    token: PropTypes.string
};
ResetPassword.displayName = 'ResetPassword';

function mapStateToProps(state) {
    return {
        apiLoading: state.api.FORGOTPASSWORD_ACCOUNT ? state.api.FORGOTPASSWORD_ACCOUNT.loading : undefined,
        apiMessage: state.api.FORGOTPASSWORD_ACCOUNT ? state.api.FORGOTPASSWORD_ACCOUNT.message : undefined,
        apiSuccess: state.api.FORGOTPASSWORD_ACCOUNT ? state.api.FORGOTPASSWORD_ACCOUNT.success : undefined
    };
}

export default connect(mapStateToProps, actions)(ResetPassword);
