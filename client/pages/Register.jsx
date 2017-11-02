import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { connect } from 'react-redux';

import AlertPanel from '../SiteComponents/AlertPanel';
import Input from '../FormComponents/Input';

import * as actions from '../actions';
import formFields from './formFields.json';

export class Register extends React.Component {
    constructor() {
        super();

        this.onRegister = this.onRegister.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {
            username: '',
            email: '',
            password: '',
            password1: ''
        };
    }

    componentDidMount() {
        $.validator.unobtrusive.parse('form');

        this.validator = $('form').validate();
    }

    componentWillReceiveProps(props) {
        if(props.accountRegistered) {

        }
        // this.props.register(data.user, data.token);
        //     this.props.socket.emit('authenticate', data.token);
        //     this.props.navigate('/');
    }

    componentWillUnmount() {
        this.validator.destroy();
    }

    onChange(field, event) {
        var newState = {};

        newState[field] = event.target.value;
        this.setState(newState);
    }

    onRegister(event) {
        event.preventDefault();

        if(!$('form').valid()) {
            return;
        }

        this.props.registerAccount({ username: this.state.username, password: this.state.password, email: this.state.email });
    }

    render() {
        const fieldsToRender = formFields.register.map(field => {
            return (<Input key={ field.name } name={ field.name } label={ field.label } placeholder={ field.placeholder }
                validationAttributes={ field.validationProperties } fieldClass={ field.fieldClass } labelClass={ field.labelClass }
                type={ field.inputType } onChange={ this.onChange.bind(this, field.name) } value={ this.state[field.name] } />);
        });

        var errorBar = this.props.apiMessage ? <AlertPanel type='error' message={ this.props.apiMessage } /> : null;

        return (
            <div className='col-sm-6 col-sm-offset-3'>
                { errorBar }
                <div className='panel-title'>
                    Register an account
                </div>
                <div className='panel'>
                    <form className='form form-horizontal'>
                        { fieldsToRender }
                        <div className='form-group'>
                            <div className='col-sm-offset-4 col-sm-3'>
                                <button ref='submit' type='submit' className='btn btn-primary' onClick={ this.onRegister }>Register</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>);
    }
}

Register.displayName = 'Register';
Register.propTypes = {
    accountRegistered: PropTypes.bool,
    apiMessage: PropTypes.string,
    navigate: PropTypes.func,
    register: PropTypes.func,
    registerAccount: PropTypes.func,
    socket: PropTypes.object
};

function mapStateToProps(state) {
    return {
        accountRegistered: state.api.REGISTER_ACCOUNT ? state.api.REGISTER_ACCOUNT.success : false,
        apiMessage: state.api.REGISTER_ACCOUNT ? state.api.REGISTER_ACCOUNT.message : undefined,
        socket: state.socket.socket
    };
}

export default connect(mapStateToProps, actions)(Register);
