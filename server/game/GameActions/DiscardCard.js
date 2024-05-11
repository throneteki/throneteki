const GameAction = require('./GameAction');
const LeavePlay = require('./LeavePlay');
const Message = require('../Message');
const MoveCardEventGenerator = require('./MoveCardEventGenerator');

class DiscardCard extends GameAction {
    constructor() {
        super('discard');
    }

    message({ card }) {
        if(card.location === 'play area') {
            return Message.fragment('discards {card} from play', { card });
        }
        if(card.location === 'duplicate') {
            return Message.fragment('discards a duplicate from {parent}', { parent: card.parent });
        }
        if(card.location === 'underneath') {
            return Message.fragment('discards {card} from underneath {parent}', { card, parent: card.parent });
        }

        return Message.fragment('discards {card} from {controller}\'s {location}', { card, controller: card.controller, location: card.location });
    }

    canChangeGameState({ card, isRandom = false, context }) {
        if(card.location === 'play area' && !LeavePlay.allow({ card })) {
            return false;
        }
        // TODO: Change all random discards to use GameActions.discardAtRandom rather than this
        if(isRandom && !card.allowGameAction('discardAtRandom', { card, context })) {
            return false;
        }
        return ['draw deck', 'hand', 'play area', 'shadows', 'duplicate', 'underneath'].includes(card.location);
    }

    createEvent({ card, allowSave = true, isPillage = false, isRandom = false, source, orderable }) {
        return MoveCardEventGenerator.createDiscardCardEvent({ card, allowSave, isPillage, source, isRandom, orderable });
    }
}

module.exports = new DiscardCard();
