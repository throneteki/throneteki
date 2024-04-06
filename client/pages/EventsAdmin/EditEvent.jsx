import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import EventEditor from './EventEditor';

class EditEvent extends React.Component {
    componentWillMount() {
        const {loadDraftCubes, loadEventEditor, eventId} = this.props;

        loadDraftCubes();
        loadEventEditor(eventId);
    }

    componentWillReceiveProps(newProps) {
        if(newProps.eventSaved) {
            newProps.navigate('/events');
        }
    }

    render() {
        const { apiState, cards, draftCubes, eventId, events, navigate, packs, saveEvent, restrictedLists } = this.props;

        if(!cards || !packs || !events || !restrictedLists || !draftCubes) {
            return <div>Please wait while loading from the server...</div>;
        }

        return (
            <EventEditor { ...{
                apiState,
                cards,
                draftCubes,
                event: events.find(event => event._id === eventId),
                navigate,
                packs,
                onEventSave: saveEvent,
                restrictedLists: restrictedLists
            } } />
        );
    }
}

EditEvent.displayName = 'EditEvent';
EditEvent.propTypes = {
    apiState: PropTypes.object,
    cards: PropTypes.object,
    draftCubes: PropTypes.array,
    eventId: PropTypes.string,
    events: PropTypes.array,
    loadDraftCubes: PropTypes.func,
    loadEventEditor: PropTypes.func,
    navigate: PropTypes.func,
    packs: PropTypes.array,
    restrictedLists : PropTypes.array,
    saveEvent: PropTypes.func
};

function mapStateToProps(state) {
    return {
        apiState: state.api.SAVE_EVENT,
        cards: state.cards.cards,
        draftCubes: state.events.draftCubes,
        events: state.events.events,
        eventSaved: state.events.eventSaved,
        loading: state.api.loading,
        packs: state.cards.packs,
        restrictedLists: state.cards.restrictedList
    };
}

export default connect(mapStateToProps, actions)(EditEvent);
