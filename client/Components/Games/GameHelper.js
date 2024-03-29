import { cardSetLabel } from '../Decks/DeckHelper';

export function createGameTitle(gameName, eventName, cardSet) {
    return eventName ? `${eventName} - ${gameName}` : `${cardSetLabel(cardSet)} - ${gameName}`;
}
