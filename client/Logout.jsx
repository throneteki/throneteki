import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import {connect} from 'react-redux';
import * as actions from './actions';

class InnerLogout extends React.Component {
    componentWillMount() {
        $.ajax({
            url: '/api/account/logout',
            type: 'POST',
            contentType: 'application/json'
        }).always(() => {
            this.props.logout();
            this.props.navigate('/');
        });
    }

    render() {
        return (<div>Logging out, please wait while you are redirected</div>);
    }
}

InnerLogout.displayName = 'Logout';
InnerLogout.propTypes = {
    logout: PropTypes.func,
    navigate: PropTypes.func
};

const Logout = connect(function() {
    return { };
}, actions)(InnerLogout);

export default Logout;
