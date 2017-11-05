import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { connect } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';

import AlertPanel from '../SiteComponents/AlertPanel.jsx';
import Input from '../FormComponents/Input';

import * as actions from '../actions';
import formFields from './formFields.json';

class ForgotPassword extends React.Component {
    constructor() {
        super();

        this.state = {
            username: '',
            password: '',
            captcha: ''
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        $.validator.unobtrusive.parse('form');

        this.validator = $('form').validate();
    }

    componentWillUnmount() {
        this.validator.destroy();
    }

    onChange(field, event) {
        var newState = {};

        newState[field] = event.target.value;
        this.setState(newState);
    }

    onCaptchaChange(value) {
        this.setState({ captcha: value });
    }

    onSubmit(event) {
        event.preventDefault();

        if(!$('form').valid()) {
            return;
        }

        this.props.forgotPassword({ username: this.state.username, captcha: this.state.captcha });
    }

    render() {
        const fieldsToRender = formFields.forgotpassword.map(field => {
            return (<Input key={ field.name } name={ field.name } label={ field.label } placeholder={ field.placeholder }
                validationAttributes={ field.validationProperties } fieldClass={ field.fieldClass } labelClass={ field.labelClass }
                type={ field.inputType } onChange={ this.onChange.bind(this, field.name) } value={ this.state[field.name] } />);
        });

        let errorBar = this.props.apiSuccess === false ? <AlertPanel type='error' message={ this.props.apiMessage } /> : null;
        let successBar = this.props.apiSuccess ? <AlertPanel type='success' message='Your request was submitted.  If the username you entered is registered with the site, an email will be sent to the address registered on the account, detailing what to do next.' /> : null;

        if(this.props.apiSuccess) {
            return <div className='col-sm-6 col-sm-offset-3'>{ successBar }</div>;
        }

        return (
            <div>
                <div className='col-sm-6 col-sm-offset-3'>
                    { errorBar }
                    { this.props.apiSuccess === false ? null : <AlertPanel type='info' message='To start the password recovery process, please enter your username and click the submit button.' /> }
                    <div className='panel-title'>
                        Forgot password
                    </div>
                    <div className='panel'>
                        <form className='form form-horizontal'>
                            { fieldsToRender }
                            <div className='form-group'>
                                <div className='col-sm-offset-2 col-sm-3'>
                                    <ReCAPTCHA ref='recaptcha' sitekey='6LfELhMUAAAAAKbD2kLd6OtbsBbrZJFs7grwOREZ' theme='dark' onChange={ this.onCaptchaChange.bind(this) } />
                                </div>
                            </div>
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

ForgotPassword.displayName = 'ForgotPassword';
ForgotPassword.propTypes = {
    apiLoading: PropTypes.bool,
    apiMessage: PropTypes.string,
    apiSuccess: PropTypes.bool,
    forgotPassword: PropTypes.func,
    login: PropTypes.func,
    navigate: PropTypes.func,
    socket: PropTypes.object
};

function mapStateToProps(state) {
    return {
        apiLoading: state.api.FORGOTPASSWORD_ACCOUNT ? state.api.FORGOTPASSWORD_ACCOUNT.loading : undefined,
        apiMessage: state.api.FORGOTPASSWORD_ACCOUNT ? state.api.FORGOTPASSWORD_ACCOUNT.message : undefined,
        apiSuccess: state.api.FORGOTPASSWORD_ACCOUNT ? state.api.FORGOTPASSWORD_ACCOUNT.success : undefined,
        socket: state.socket.socket
    };
}

export default connect(mapStateToProps, actions)(ForgotPassword);
