export function loadCards() {
    return {
        types: ['REQUEST_CARDS', 'RECEIVE_CARDS'],
        shouldCallAPI: (state) => {
            return !state.cards.cards;
        },
        APIParams: { url: '/api/cards', cache: false },
        skipAuth: true
    };
}

export function loadPacks() {
    return {
        types: ['REQUEST_PACKS', 'RECEIVE_PACKS'],
        shouldCallAPI: (state) => {
            return !state.cards.packs;
        },
        APIParams: { url: '/api/packs', cache: false },
        skipAuth: true
    };
}

export function loadFactions() {
    return {
        types: ['REQUEST_FACTIONS', 'RECEIVE_FACTIONS'],
        shouldCallAPI: (state) => {
            return !state.cards.factions;
        },
        APIParams: { url: '/api/factions', cache: false },
        skipAuth: true
    };
}

export function loadRestrictedList() {
    return {
        types: ['REQUEST_RESTRICTED_LIST', 'RECEIVE_RESTRICTED_LIST'],
        shouldCallAPI: (state) => {
            return !state.cards.restrictedList;
        },
        APIParams: { url: '/api/restricted-list', cache: false },
        skipAuth: true
    };
}

export function loadStandaloneDecks() {
    return {
        types: ['REQUEST_STANDALONE_DECKS', 'RECEIVE_STANDALONE_DECKS'],
        shouldCallAPI: (state) => {
            return !state.cards.standaloneDecks;
        },
        APIParams: { url: '/api/standalone-decks', cache: false },
        skipAuth: true
    };
}

export function setCurrentRestrictedList(currentRestrictedList) {
    return {
        type: 'SET_CURRENT_RESTRICTED_LIST',
        currentRestrictedList
    };
}
