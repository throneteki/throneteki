const GameAction = require('./GameAction');
const LeavePlay = require('./LeavePlay');
const MoveCardEventGenerator = require('./MoveCardEventGenerator');

class DiscardCard extends GameAction {
    constructor() {
        super('discard');
    }

    canChangeGameState({ card, isRandom = false, context  }) {
        if(card.location === 'play area' && !LeavePlay.allow({ card })) {
            return false;
        }
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
