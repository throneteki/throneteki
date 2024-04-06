import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ApiStatus from '../Components/Site/ApiStatus';

import * as actions from '../actions';

class Logout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentWillMount() {
        this.props.logout();
    }

    componentWillReceiveProps(props) {
        if(props.loggedOut) {
            this.setState({ successMessage: 'You were successfully logged out, redirecting you shortly.' });

            setTimeout(() => {
                this.props.navigate('/');
            }, 2000);
        }
    }

    render() {
        return (
            <div className='col-sm-6 col-sm-offset-3'>
                <ApiStatus apiState={ this.props.apiState } successMessage={ this.state.successMessage } />

                { this.props.apiState && this.props.apiState.loading && <span>Logging you out of your account, please wait...</span> }
            </div>);
    }
}

Logout.displayName = 'Logout';
Logout.propTypes = {
    apiState: PropTypes.bool,
    loggedOut: PropTypes.bool,
    logout: PropTypes.func,
    navigate: PropTypes.func
};

function mapStateToProps(state) {
    return {
        apiState: state.api.LOGOUT_ACCOUNT,
        loggedOut: state.account.loggedOut
    };
}

export default connect(mapStateToProps, actions)(Logout);
