import { validateDeck, formatDeckAsFullCards } from '../../deck-helper';

function selectDeck(state, deck) {
    if(state.decks.length !== 0) {
        state.selectedDeck = deck;
    } else {
        delete state.selectedDeck;
    }

    return state;
}

function processDecks(decks, state) {
    if(!decks) {
        return;
    }

    return decks.map(deck => processDeck(deck, state));
}

function processDeck(deck, state) {
    if(!state.cards || !deck || !deck.faction) {
        return Object.assign({ status: {} }, deck);
    }

    let formattedDeck = formatDeckAsFullCards(deck, state);
    //copy over the locked properties from the server deck object
    formattedDeck.lockedForEditing = deck.lockedForEditing;
    formattedDeck.lockedForDeletion = deck.lockedForDeletion;
    const fallbackRestrictedList = state.restrictedList ? state.restrictedList.slice(0, 1) : undefined;
    const restrictedLists = state.currentRestrictedList ? [state.currentRestrictedList] : fallbackRestrictedList;

    if(!restrictedLists) {
        formattedDeck.status = {};
    } else {
        formattedDeck.status = validateDeck(formattedDeck, { packs: state.packs, restrictedLists });
    }

    return formattedDeck;
}

export default function(state = { decks: [] }, action) {
    let newState;
    switch(action.type) {
        case 'RECEIVE_CARDS':
            var agendas = {};

            for(const card of Object.values(action.response.cards)) {
                if(card.type === 'agenda') {
                    agendas[card.code] = card;
                }
            }

            var banners = Object.values(agendas).filter(card => {
                return card.traits.includes('Banner');
            });

            newState = Object.assign({}, state, {
                cards: action.response.cards,
                agendas: agendas,
                banners: banners
            });

            // In case the card list is received after the decks, updated the decks now
            newState.decks = processDecks(newState.decks, newState);

            return newState;
        case 'RECEIVE_PACKS':
            return Object.assign({}, state, {
                packs: action.response.packs
            });
        case 'RECEIVE_FACTIONS':
            var factions = {};

            for(const faction of action.response.factions) {
                factions[faction.value] = faction;
            }

            newState = Object.assign({}, state, {
                factions: factions
            });

            // In case the factions are received after the decks, updated the decks now
            newState.decks = processDecks(newState.decks, newState);

            return newState;
        case 'RECEIVE_RESTRICTED_LIST':
            newState = Object.assign({}, state, {
                restrictedList: action.response.restrictedList
            });

            // In case the restricted list is received after the decks, updated the decks now
            newState.decks = processDecks(newState.decks, newState);

            return newState;
        case 'SET_CURRENT_RESTRICTED_LIST':
            newState = Object.assign({}, state, {
                currentRestrictedList: action.currentRestrictedList
            });

            // Force an update to the validation results
            newState.decks = processDecks(newState.decks, newState);
            if(newState.selectedDeck) {
                newState.selectedDeck = processDeck(newState.selectedDeck, newState);
            }

            return newState;
        case 'RECEIVE_STANDALONE_DECKS':
            return Object.assign({}, state, {
                standaloneDecks: processDecks(action.response.decks, state)
            });
        case 'ZOOM_CARD':
            return Object.assign({}, state, {
                zoomCard: action.card
            });
        case 'CLEAR_ZOOM':
            return Object.assign({}, state, {
                zoomCard: undefined
            });
        case 'RECEIVE_DECKS':
            newState = Object.assign({}, state, {
                singleDeck: false,
                decks: processDecks(action.response.decks, state)
            });

            newState = selectDeck(newState, newState.decks[0]);

            return newState;
        case 'REQUEST_DECK':
            return Object.assign({}, state, {
                deckSaved: false,
                deckDeleted: false
            });
        case 'REQUEST_DECKS':
            newState = Object.assign({}, state, {
                deckSaved: false,
                deckDeleted: false
            });

            if(newState.selectedDeck && !newState.selectedDeck._id) {
                if(newState.decks.length !== 0) {
                    newState.selectedDeck = newState.decks[0];
                }
            }

            return newState;
        case 'RECEIVE_DECK':
            newState = Object.assign({}, state, {
                singleDeck: true,
                deckSaved: false
            });

            if(!newState.decks.some(deck => deck._id === action.response.deck._id)) {
                newState.decks.push(processDeck(action.response.deck, state));
            }

            var selected = newState.decks.find(deck => {
                return deck._id === action.response.deck._id;
            });

            newState = selectDeck(newState, selected);

            return newState;
        case 'SELECT_DECK':
            return Object.assign({}, state, {
                selectedDeck: processDeck(action.deck, state),
                deckSaved: false
            });
        case 'ADD_DECK':
            var newDeck = { name: 'New Deck', drawCards: [], plotCards: [] };

            return Object.assign({}, state, {
                selectedDeck: processDeck(newDeck, state),
                deckSaved: false
            });
        case 'UPDATE_DECK':
            return Object.assign({}, state, {
                selectedDeck: processDeck(action.deck, state),
                deckSaved: false
            });
        case 'SAVE_DECK':
            newState = Object.assign({}, state, {
                deckSaved: false
            });

            return newState;
        case 'DECK_SAVED':
            newState = Object.assign({}, state, {
                deckSaved: true,
                decks: []
            });

            return newState;
        case 'DECK_DELETED':
            newState = Object.assign({}, state, {
                deckDeleted: true
            });

            newState.decks = newState.decks.filter(deck => {
                return deck._id !== action.response.deckId;
            });

            newState.selectedDeck = newState.decks[0];

            return newState;
        case 'CLEAR_DECK_STATUS':
            return Object.assign({}, state, {
                deckDeleted: false,
                deckSaved: false
            });
        default:
            return state;
    }
}
