import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ApiStatus from '../Components/Site/ApiStatus';
import Panel from '../Components/Site/Panel';
import Form from '../Components/Form/Form';
import Link from '../Components/Site/Link';

import * as actions from '../actions';

export class Register extends React.Component {
    constructor() {
        super();

        this.onRegister = this.onRegister.bind(this);

        this.state = {
            successMessage: '',
            enableGravatar: true
        };
    }

    componentWillReceiveProps(props) {
        if (props.accountRegistered) {
            this.setState({
                successMessage:
                    'Your account was successfully registered.  Please verify your account using the link in the email sent to the address you have provided.'
            });

            setTimeout(() => {
                this.props.navigate('/');
            }, 2000);
        }
    }

    onRegister(state) {
        this.props.registerAccount({
            username: state.username,
            password: state.password,
            email: state.email,
            enableGravatar: state.enableGravatar
        });
    }

    onEnableGravatarChanged(event) {
        this.setState({ enableGravatar: event.target.checked });
    }

    render() {
        return (
            <div className='col-sm-6 col-sm-offset-3'>
                <ApiStatus
                    apiState={this.props.apiState}
                    successMessage={this.state.successMessage}
                />
                <Panel title='Register an account'>
                    <p>
                        We require information from you in order to service your access to the site.
                        Please see the <Link href='/privacy'>privacy policy</Link> for details on
                        why we need this information and what we do with it. Please pay particular
                        attention to the section on avatars.
                    </p>

                    <Form
                        name='register'
                        apiLoading={this.props.apiState && this.props.apiState.loading}
                        buttonClass='col-sm-offset-4 col-sm-3'
                        buttonText='Register'
                        onSubmit={this.onRegister}
                    />
                </Panel>
            </div>
        );
    }
}

Register.displayName = 'Register';
Register.propTypes = {
    accountRegistered: PropTypes.bool,
    apiState: PropTypes.object,
    navigate: PropTypes.func,
    register: PropTypes.func,
    registerAccount: PropTypes.func,
    registeredToken: PropTypes.string,
    registeredUser: PropTypes.object,
    socket: PropTypes.object
};

function mapStateToProps(state) {
    return {
        accountRegistered: state.account.registered,
        apiState: state.api.REGISTER_ACCOUNT,
        socket: state.lobby.socket
    };
}

export default connect(mapStateToProps, actions)(Register);
