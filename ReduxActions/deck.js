export function loadDecks() {
    return {
        types: ['REQUEST_DECKS', 'RECEIVE_DECKS'],
        shouldCallAPI: (state) => {
            return state.cards.singleDeck || state.cards.decks.length === 0;
        },
        APIParams: { url: '/api/decks', cache: false }
    };
}

export function loadDeck(deckId) {
    return {
        types: ['REQUEST_DECK', 'RECEIVE_DECK'],
        shouldCallAPI: (state) => {
            let ret = state.cards.decks.length === 0 || !state.cards.decks.some(deck => {
                return deck._id === deckId;
            });

            return ret;
        },
        APIParams: { url: `/api/decks/${deckId}`, cache: false }
    };
}

export function selectDeck(deck) {
    return {
        type: 'SELECT_DECK',
        deck: deck
    };
}

export function addDeck() {
    return {
        type: 'ADD_DECK'
    };
}

export function updateDeck(deck) {
    return {
        type: 'UPDATE_DECK',
        deck: deck
    };
}

export function deleteDeck(deck) {
    return {
        types: ['DELETE_DECK', 'DECK_DELETED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/decks/${deck._id}`,
            type: 'DELETE'
        }
    };
}

export function saveDeck(deck) {
    let str = JSON.stringify({
        deck: {
            deckName: deck.name,
            faction: { name: deck.faction.name, value: deck.faction.value },
            agenda: deck.agenda ? { code: deck.agenda.code } : null,
            plotCards: formatCards(deck.plotCards),
            drawCards: formatCards(deck.drawCards),
            bannerCards: deck.bannerCards.map(card => {
                return { code: card.code };
            }),
            rookeryCards: deck.rookeryCards ? formatCards(deck.rookeryCards) : []
        }
    });

    return {
        types: ['SAVE_DECK', 'DECK_SAVED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/decks/${(deck._id || '')}`,
            type: deck._id ? 'PUT' : 'POST',
            data: str
        }
    };
}

export function clearDeckStatus() {
    return {
        type: 'CLEAR_DECK_STATUS'
    };
}

function formatCards(cards) {
    return cards.map(card => {
        let cardData = card.card.custom ? card.card : { code: card.card.code };
        return { card: cardData, count: card.count };
    });
}
