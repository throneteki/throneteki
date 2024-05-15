import GameAction from './GameAction.js';
import Message from '../Message.js';
import LeavePlay from './LeavePlay.js';
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

    createEvent({ player, card, allowSave = true, reason = 'ability' }) {
        const params = {
            card,
            player: player || card.controller,
            allowSave,
            snapshotName: 'cardStateWhenMoved',
            reason
        };

        const putIntoShadowsEvent = this.event('onCardPutIntoShadows', params, (event) => {
            event.thenAttachEvent(
                PlaceCard.createEvent({
                    card: event.card,
                    player: event.player,
                    location: 'shadows'
                })
            );
        });

        if (card.location === 'play area') {
            return this.atomic(putIntoShadowsEvent, LeavePlay.createEvent({ card, allowSave }));
        }

        return putIntoShadowsEvent;
    }
}

export default new PutIntoShadows();
