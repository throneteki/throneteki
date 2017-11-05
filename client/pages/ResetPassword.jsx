import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import { connect } from 'react-redux';
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

    componentDidMount() {
        $.validator.unobtrusive.parse('form');

        this.validator = $('form').validate();
    }

    componentWillReceiveProps(props) {
        if(props.accountPasswordReset) {
            this.setState({ successMessage: 'Your password has been changed.  You will shortly be redirected to the login page.' });

            setTimeout(() => {
                this.props.navigate('/login');
            }, 3000);
        }
    }

    onChange(field, event) {
        var newState = {};

        newState[field] = event.target.value;
        this.setState(newState);
    }

    onSubmit(event) {
        event.preventDefault();

        if(!$('form').valid()) {
            return;
        }

        this.props.resetPassword({ id: this.props.id, token: this.props.token, newPassword: this.state.password });
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
        let successBar = this.state.successMessage ? <AlertPanel type='success' message={ this.state.successMessage } /> : null;

        return (
            <div>
                <div className='col-sm-6 col-sm-offset-3'>
                    { errorBar }
                    { successBar }
                    <div className='panel-title'>
                        Reset password
                    </div>
                    <div className='panel'>
                        <form className='form form-horizontal'>
                            { fieldsToRender }
                            <div className='form-group'>
                                <div className='col-sm-offset-2 col-sm-3'>
                                    <button type='submit' className='btn btn-primary' onClick={ this.onSubmit } disabled={ this.props.apiLoading }>
                                        Submit { this.props.apiLoading ? <span className='spinner button-spinner' /> : null }
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>);
    }
}

ResetPassword.propTypes = {
    accountPasswordReset: PropTypes.bool,
    apiLoading: PropTypes.bool,
    apiMessage: PropTypes.string,
    apiSuccess: PropTypes.bool,
    id: PropTypes.string,
    navigate: PropTypes.func,
    resetPassword: PropTypes.func,
    token: PropTypes.string
};
ResetPassword.displayName = 'ResetPassword';

function mapStateToProps(state) {
    return {
        accountPasswordReset: state.account.passwordReset,
        apiLoading: state.api.RESETPASSWORD_ACCOUNT ? state.api.RESETPASSWORD_ACCOUNT.loading : undefined,
        apiMessage: state.api.RESETPASSWORD_ACCOUNT ? state.api.RESETPASSWORD_ACCOUNT.message : undefined,
        apiSuccess: state.api.RESETPASSWORD_ACCOUNT ? state.api.RESETPASSWORD_ACCOUNT.success : undefined
    };
}

export default connect(mapStateToProps, actions)(ResetPassword);
