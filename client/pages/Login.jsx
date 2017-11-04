import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import {connect} from 'react-redux';

import Link from '../Link.jsx';
import AlertPanel from '../SiteComponents/AlertPanel.jsx';
import Input from '../FormComponents/Input';

import * as actions from '../actions';
import formFields from './formFields.json';

class Login extends React.Component {
    constructor() {
        super();

        this.state = {
            username: '',
            password: ''
        };

        this.onChange = this.onChange.bind(this);
        this.onLogin = this.onLogin.bind(this);
    }

    componentDidMount() {
        $.validator.unobtrusive.parse('form');

        this.validator = $('form').validate();
    }

    componentWillReceiveProps(props) {
        if(props.loggedIn) {
            this.props.login(props.loggedInUser, props.loggedInToken);

            if(this.props.socket) {
                this.props.socket.emit('authenticate', props.loggedInToken);
            }

            this.props.navigate('/');
        }
    }

    onChange(field, event) {
        var newState = {};

        newState[field] = event.target.value;
        this.setState(newState);
    }

    onLogin(event) {
        event.preventDefault();

        if(!$('form').valid()) {
            return;
        }

        this.props.loginAccount({ username: this.state.username, password: this.state.password });
    }

    render() {
        const fieldsToRender = formFields.login.map(field => {
            return (<Input key={ field.name } name={ field.name } label={ field.label } placeholder={ field.placeholder }
                validationAttributes={ field.validationProperties } fieldClass={ field.fieldClass } labelClass={ field.labelClass }
                type={ field.inputType } onChange={ this.onChange.bind(this, field.name) } value={ this.state[field.name] } />);
        });

        let errorBar = this.props.apiSuccess === false ? <AlertPanel type='error' message={ this.props.apiMessage } /> : null;

        return (
            <div className='col-sm-6 col-sm-offset-3'>
                { errorBar }
                <div className='panel-title'>
                    Login
                </div>
                <div className='panel'>
                    <form className='form form-horizontal'>
                        { fieldsToRender }
                        <div className='form-group'>
                            <div className='col-sm-offset-2 col-sm-10'>
                                <Link href='/forgot' >Forgot your password?</Link>
                            </div>
                        </div>
                        <div className='form-group'>
                            <div className='col-sm-offset-2 col-sm-3'>
                                <button ref='submit' type='submit' className='btn btn-primary' onClick={ this.onLogin } disabled={ this.props.apiLoading }>
                                    Log in { this.props.apiLoading ? <span className='spinner button-spinner' /> : null }
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>);
    }
}

Login.displayName = 'Login';
Login.propTypes = {
    apiLoading: PropTypes.bool,
    apiMessage: PropTypes.string,
    apiSuccess: PropTypes.bool,
    loggedIn: PropTypes.bool,
    loggedInToken: PropTypes.string,
    loggedInUser: PropTypes.object,
    login: PropTypes.func,
    loginAccount: PropTypes.func,
    navigate: PropTypes.func,
    socket: PropTypes.object
};

function mapStateToProps(state) {
    return {
        apiLoading: state.api.LOGIN_ACCOUNT ? state.api.LOGIN_ACCOUNT.loading : undefined,
        apiMessage: state.api.LOGIN_ACCOUNT ?
            state.api.LOGIN_ACCOUNT.status === 401 ? 'Invalid username or password.  Please check and try again' : state.api.LOGIN_ACCOUNT.message : undefined,
        apiSuccess: state.api.LOGIN_ACCOUNT ? state.api.LOGIN_ACCOUNT.success : undefined,
        loggedIn: state.account.loggedIn,
        loggedInToken: state.account.token,
        loggedInUser: state.account.loggedInUser,
        socket: state.socket.socket
    };
}

export default connect(mapStateToProps, actions)(Login);
