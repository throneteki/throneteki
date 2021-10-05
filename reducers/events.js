export default function(state = { events: [], draftCubes: [] }, action) {
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
        case 'RECEIVE_DRAFT_CUBES':
            return Object.assign({}, state, {
                draftCubes: action.response.draftCubes
            });
        case 'LOAD_DRAFT_CUBE_EDITOR':
            return Object.assign({}, state, {
                draftCubeSaved: false
            });
        case 'DRAFT_CUBE_SAVED':
            return Object.assign({}, state, {
                draftCubeSaved: true,
                draftCubes: []
            });
        default:
            return state;
    }
}
