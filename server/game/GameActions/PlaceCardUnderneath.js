import GameAction from './GameAction.js';
import Message from '../Message.js';
import LeavePlay from './LeavePlay.js';

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
            parentCard !== card &&
            // A card that leaves play takes its attachments with it, so it cannot go under one of them
            parentCard.parent !== card &&
            !parentCard.underneath.includes(card) &&
            (parentCard.location === 'play area' || parentCard === parentCard.controller.agenda)
        );
    }

    createEvent({ card, parentCard, player, facedown = false }) {
        const placeEvent = this.event(
            'onCardPlacedUnderneath',
            { card, player, parentCard, facedown },
            (event) => {
                const player = event.player || event.card.controller;
                player.removeCardFromPile(event.card);
                event.parentCard.addChildCard(event.card, 'underneath');
                event.card.facedown = event.facedown;
            }
        );

        if (['play area', 'duplicate'].includes(card.location)) {
            return this.atomic(placeEvent, LeavePlay.createEvent({ card }));
        }

        return placeEvent;
    }
}

export default new PlaceCardUnderneath();
