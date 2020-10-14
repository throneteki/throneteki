import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import EventEditor from './EventEditor';

class EditEvent extends React.Component {
    componentWillMount() {
        const {loadEventEditor, eventId} = this.props;

        loadEventEditor(eventId);
    }

    componentWillReceiveProps(newProps) {
        if(newProps.eventSaved) {
            newProps.navigate('/events');
        }
    }

    render() {
        const { apiState, cards, eventId, events, navigate, packs, saveEvent, restrictedLists } = this.props;

        if(!cards || !packs || !events || !restrictedLists) {
            return <div>Please wait while loading from the server...</div>;
        }

        return (
            <EventEditor { ...{
                apiState,
                cards,
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
    eventId: PropTypes.string,
    events: PropTypes.array,
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
        events: state.events.events,
        eventSaved: state.events.eventSaved,
        loading: state.api.loading,
        packs: state.cards.packs,
        restrictedLists: state.cards.restrictedList
    };
}

export default connect(mapStateToProps, actions)(EditEvent);
