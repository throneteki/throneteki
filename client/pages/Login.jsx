import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Link from '../Link.jsx';
import AlertPanel from '../SiteComponents/AlertPanel';
import Panel from '../SiteComponents/Panel';
import Form from '../FormComponents/Form';

import * as actions from '../actions';

class Login extends React.Component {
    constructor() {
        super();

        this.onLogin = this.onLogin.bind(this);
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

    onLogin(state) {
        this.props.loginAccount({ username: state.username, password: state.password });
    }

    render() {
        let errorBar = this.props.apiSuccess === false ? <AlertPanel type='error' message={ this.props.apiMessage } /> : null;

        return (
            <div className='col-sm-6 col-sm-offset-3'>
                { errorBar }
                <Panel title='Login'>
                    <Form name='login' apiLoading={ this.props.apiLoading } buttonText='Log In' onSubmit={ this.onLogin }>
                        <div className='form-group'>
                            <div className='col-sm-offset-2 col-sm-10'>
                                <Link href='/forgot'>Forgot your password?</Link>
                            </div>
                        </div>
                    </Form>
                </Panel>
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
        socket: state.lobby.socket
    };
}

export default connect(mapStateToProps, actions)(Login);
