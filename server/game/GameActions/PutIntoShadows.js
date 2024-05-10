import GameAction from './GameAction.js';
import Message from '../Message.js';
import MoveCardEventGenerator from './MoveCardEventGenerator.js';

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

    createEvent({ card, allowSave = true, reason = 'ability' }) {
        return MoveCardEventGenerator.createPutIntoShadowsEvent({ card, allowSave, reason });
    }
}

export default new PutIntoShadows();
