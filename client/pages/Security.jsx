import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import AlertPanel from '../SiteComponents/AlertPanel';
import Panel from '../SiteComponents/Panel';
import * as actions from '../actions';

class Security extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            detailsLoaded: false
        };
    }

    componentWillReceiveProps(props) {
        if(!this.state.detailsLoaded && props.user) {
            this.props.loadActiveSessions(props.user);

            this.setState({ detailsLoaded: true });
        }
    }

    render() {
        let content;

        let sessions = this.props.sessions ? this.props.sessions.map(session => {
            return (
                <tr key={ session.id }>
                    <td>{ session.ip }</td>
                    <td>{ moment(session.lastUsed).format('YYYY-MM-DD HH:mm') }</td>
                    <td><a href='#' className='btn'><span className='glyphicon glyphicon-remove' /></a></td>
                </tr>
            );
        }) : null;
        let table = (this.props.sessions && this.props.sessions.length === 0) ? <div>You have no active sessions.  This shouldn't really happen.</div> : (
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>IP Address</th>
                        <th>Last Used</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    { sessions }
                </tbody>
            </table>
        );

        if(this.props.loading) {
            content = <div>Loading session details from the server...</div>;
        } else if(this.props.apiError) {
            content = <AlertPanel type='error' message={ this.props.apiError } />;
        } else {
            content = (
                <div className='col-sm-8 col-sm-offset-2 profile full-height'>
                    <Panel title='Active Sessions'>
                        <p className='help-block'>
                            Below you will see the active 'sessions' that you have on the website.
                            If you see any unexpected activity on your account, remove the session and consider changing your password.
                        </p>
                        { table }
                    </Panel>
                </div>);
        }

        return content;
    }
}

Security.displayName = 'Security';
Security.propTypes = {
    apiError: PropTypes.string,
    loadActiveSessions: PropTypes.func,
    loading: PropTypes.bool,
    sessions: PropTypes.array,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        apiError: state.api.message,
        loading: state.api.loading,
        sessions: state.user.sessions,
        user: state.account.user
    };
}

export default connect(mapStateToProps, actions)(Security);
