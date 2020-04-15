export function loadEvents() {
    return {
        types: ['REQUEST_EVENTS', 'RECEIVE_EVENTS'],
        shouldCallAPI: (state) => {
            return state.events.events.length === 0;
        },
        APIParams: { url: '/api/events', cache: false },
        skipAuth: true
    };
}

export function loadEventEditor(eventId) {
    return {
        type: 'LOAD_EVENT_EDITOR',
        eventId
    };
}

export function deleteEvent(eventId) {
    return {
        types: ['DELETE_EVENT', 'EVENT_DELETED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/events/${eventId}`,
            type: 'DELETE'
        }
    };
}

export function saveEvent(event) {
    let str = JSON.stringify({
        event
    });

    return {
        types: ['SAVE_EVENT', 'EVENT_SAVED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/events/${(event._id || '')}`,
            type: event._id ? 'PUT' : 'POST',
            data: str
        }
    };
}
