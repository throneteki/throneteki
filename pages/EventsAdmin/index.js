import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Panel from '../../Components/Site/Panel';
import * as actions from '../../actions';

class EventsAdmin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentRequest: 'REQUEST_EVENTS'
        };
    }

    componentWillMount() {
        this.props.loadEvents();
    }

    handleDeleteClick(id) {
        this.setState({ currentRequest: 'DELETE_EVENT' });
        this.props.deleteEvent(id);
    }

    render() {
        if(this.props.apiState && this.props.apiState.loading) {
            return 'Loading events, please wait...';
        }

        const { events, navigate } = this.props;

        return (
            <div className='col-xs-12'>
                <Panel title='Events administration'>
                    <a className='btn btn-primary' onClick={ () => navigate('/events/add') }>Add event</a>
                    <table className='table table-striped'>
                        <thead>
                            <tr>
                                <th className='col-sm-2'>Event</th>
                                <th className='col-sm-2'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            { events.map(event => (
                                <tr>
                                    <td>{ event.name }</td>
                                    <td>
                                        <button className='btn btn-primary' onClick={ () => navigate(`/events/${event._id}`) }>Edit</button>
                                        <button className='btn btn-danger' onClick={ () => this.handleDeleteClick(event._id) }>Delete</button>
                                    </td>
                                </tr>
                            )) }
                        </tbody>
                    </table>
                </Panel>
            </div>);
    }
}

EventsAdmin.displayName = 'EventsAdmin';
EventsAdmin.propTypes = {
    apiState: PropTypes.object,
    deleteEvent: PropTypes.func,
    events: PropTypes.array,
    loadEvents: PropTypes.func,
    navigate: PropTypes.func
};

function mapStateToProps(state) {
    return {
        apiState: state.api.REQUEST_EVENTS,
        events: state.events.events,
        loadBanlist: state.admin.loadBanlist
    };
}

export default connect(mapStateToProps, actions)(EventsAdmin);
