const GameAction = require('./GameAction');
const MoveCardEventGenerator = require('./MoveCardEventGenerator');

class ReturnCardToHand extends GameAction {
    constructor() {
        super('returnToHand');
    }

    canChangeGameState({ card }) {
        return ['dead pile', 'discard pile', 'play area', 'shadows', 'duplicate'].includes(card.location);
    }

    createEvent({ card, allowSave = true }) {
        return MoveCardEventGenerator.createReturnCardToHandEvent({ card, allowSave });
    }
}

module.exports = new ReturnCardToHand();
