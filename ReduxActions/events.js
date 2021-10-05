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

export function loadDraftCubes() {
    return {
        types: ['REQUEST_DRAFT_CUBES', 'RECEIVE_DRAFT_CUBES'],
        shouldCallAPI: (state) => {
            return state.events.draftCubes.length === 0;
        },
        APIParams: { url: '/api/draft-cubes', cache: false },
        skipAuth: true
    };
}

export function loadDraftCubeEditor(draftCubeId) {
    return {
        type: 'LOAD_DRAFT_CUBE_EDITOR',
        draftCubeId
    };
}

export function deleteDraftCube(draftCubeId) {
    return {
        types: ['DELETE_DRAFT_CUBE', 'DRAFT_CUBE_DELETED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/draft-cubes/${draftCubeId}`,
            type: 'DELETE'
        }
    };
}

export function saveDraftCube(draftCube) {
    let str = JSON.stringify({
        draftCube
    });

    return {
        types: ['SAVE_DRAFT_CUBE', 'DRAFT_CUBE_SAVED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/draft-cubes/${(draftCube._id || '')}`,
            type: draftCube._id ? 'PUT' : 'POST',
            data: str
        }
    };
}
