const GameAction = require('./GameAction');
const LeavePlay = require('./LeavePlay');
const MoveCardEventGenerator = require('./MoveCardEventGenerator');

class DiscardCard extends GameAction {
    constructor() {
        super('discard');
    }

    canChangeGameState({ card }) {
        if(card.location === 'play area' && !LeavePlay.allow({ card })) {
            return false;
        }

        return ['draw deck', 'hand', 'play area', 'shadows', 'duplicate', 'underneath'].includes(card.location);
    }

    createEvent({ card, allowSave = true, isPillage = false, isRandom = false, source }) {
        return MoveCardEventGenerator.createDiscardCardEvent({ card, allowSave, isPillage, isRandom, source });
    }
}

module.exports = new DiscardCard();
