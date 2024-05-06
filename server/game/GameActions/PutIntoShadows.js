import GameAction from './GameAction.js';
import Message from '../Message.js';
import PlaceCard from './PlaceCard.js';

class PutIntoShadows extends GameAction {
    constructor() {
        super('putIntoShadows');
    }

    message({ card }) {
        return Message.fragment('puts {card} into shadows', { card });
    }

    canChangeGameState({ player, card }) {
        player = player || card.controller;
        return (
            card.location !== 'shadows' &&
            player.canPutIntoShadows(card, card.game.currentPhase === 'setup' ? 'setup' : 'put')
        );
    }

    createEvent({
        card,
        allowSave = true,
        reason = 'ability',
        placeCardEvent = PlaceCard.createEvent({
            card,
            player: card.controller,
            location: 'shadows'
        })
    }) {
        const params = {
            card,
            allowSave,
            snapshotName: 'cardStateWhenMoved',
            reason,
            placeCardEvent
        };

        const putIntoShadowsEvent = this.event('onCardPutIntoShadows', params);
        putIntoShadowsEvent.addChildEvent(placeCardEvent);

        return putIntoShadowsEvent;
    }
}

export default new PutIntoShadows();
