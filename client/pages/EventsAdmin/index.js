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
        this.props.loadDraftCubes();
        this.props.loadEvents();
    }

    handleDeleteClick(id) {
        this.setState({ currentRequest: 'DELETE_EVENT' });
        this.props.deleteEvent(id);
    }

    handleDeleteDraftCubeClick(id) {
        this.setState({ currentRequest: 'DELETE_DRAFT_CUBE' });
        this.props.deleteDraftCube(id);
    }

    render() {
        if(this.props.apiState && this.props.apiState.loading || !this.props.draftCubes) {
            return 'Loading events, please wait...';
        }

        const { draftCubes, events, navigate } = this.props;

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
                <Panel title='Draft Cubes'>
                    <a className='btn btn-primary' onClick={ () => navigate('/events/draft-cubes/add') }>Add draft cube</a>
                    <table className='table table-striped'>
                        <thead>
                            <tr>
                                <th className='col-sm-2'>Draft Cube</th>
                                <th className='col-sm-2'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            { draftCubes.map(draftCube => (
                                <tr key={ `draft-cube:${draftCubes.name}` }>
                                    <td>{ draftCube.name }</td>
                                    <td>
                                        <button className='btn btn-primary' onClick={ () => navigate(`/events/draft-cubes/${draftCube._id}`) }>Edit</button>
                                        <button className='btn btn-danger' onClick={ () => this.handleDeleteDraftCubeClick(draftCube._id) }>Delete</button>
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
    deleteDraftCube: PropTypes.func,
    deleteEvent: PropTypes.func,
    draftCubes: PropTypes.array,
    events: PropTypes.array,
    loadDraftCubes: PropTypes.func,
    loadEvents: PropTypes.func,
    navigate: PropTypes.func
};

function mapStateToProps(state) {
    return {
        apiState: state.api.REQUEST_EVENTS,
        draftCubes: state.events.draftCubes,
        events: state.events.events
    };
}

export default connect(mapStateToProps, actions)(EventsAdmin);
