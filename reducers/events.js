export default function(state = { events: [] }, action) {
    let newState;
    switch(action.type) {
        case 'RECEIVE_EVENTS':
            return Object.assign({}, state, {
                events: action.response.events
            });
        case 'LOAD_EVENT_EDITOR':
            return Object.assign({}, state, {
                eventSaved: false
            });
        case 'EVENT_SAVED':
            newState = Object.assign({}, state, {
                eventSaved: true,
                events: []
            });

            return newState;
        case 'EVENT_DELETED':
            newState = Object.assign({}, state, {
                eventDeleted: true
            });

            newState.events = newState.events.filter(event => {
                return event._id !== action.response.eventId;
            });

            return newState;
        default:
            return state;
    }
}
