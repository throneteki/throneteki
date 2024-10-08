import GameAction from './GameAction.js';
import Message from '../Message.js';

class PlaceCardUnderneath extends GameAction {
    constructor() {
        super('placeCardUnderneath');
    }

    message({ card, parentCard, facedown = false }) {
        return Message.fragment('places {card} underneath {parentCard}', {
            card: facedown ? 'a card facedown' : card,
            parentCard
        });
    }

    canChangeGameState({ card, parentCard }) {
        return (
            parentCard &&
            !parentCard.underneath.includes(card) &&
            (parentCard.location === 'play area' || parentCard === parentCard.controller.agenda)
        );
    }

    createEvent({ card, parentCard, player, facedown = false }) {
        return this.event(
            'onCardPlacedUnderneath',
            { card, player, parentCard, facedown },
            (event) => {
                // TODO: Improve the logic for underneath cards to share location with their parentCard rather than using 'underneath'
                const player = event.player || event.card.controller;
                player.removeCardFromPile(event.card);
                event.parentCard.addChildCard(event.card, 'underneath');
                event.card.facedown = event.facedown;
            }
        );
    }
}

export default new PlaceCardUnderneath();
