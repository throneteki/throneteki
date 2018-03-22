export function loadCards() {
    return {
        types: ['REQUEST_CARDS', 'RECEIVE_CARDS'],
        shouldCallAPI: (state) => {
            return !state.cards.cards;
        },
        APIParams: { url: '/api/cards', cache: false }
    };
}

export function loadPacks() {
    return {
        types: ['REQUEST_PACKS', 'RECEIVE_PACKS'],
        shouldCallAPI: (state) => {
            return !state.cards.packs;
        },
        APIParams: { url: '/api/packs', cache: false }
    };
}

export function loadFactions() {
    return {
        types: ['REQUEST_FACTIONS', 'RECEIVE_FACTIONS'],
        shouldCallAPI: (state) => {
            return !state.cards.factions;
        },
        APIParams: { url: '/api/factions', cache: false }
    };
}

export function loadRestrictedList() {
    return {
        types: ['REQUEST_RESTRICTED_LIST', 'RECEIVE_RESTRICTED_LIST'],
        shouldCallAPI: (state) => {
            return !state.cards.restrictedList;
        },
        APIParams: { url: '/api/restricted-list', cache: false }
    };
}
