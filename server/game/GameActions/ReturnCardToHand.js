const Message = require('../Message');
const GameAction = require('./GameAction');
const LeavePlay = require('./LeavePlay');
const MoveCardEventGenerator = require('./MoveCardEventGenerator');

class ReturnCardToHand extends GameAction {
    constructor() {
        super('returnToHand');
    }

    message({ card, context }) {
        let controller = card.controller === context.player ? 'their' : Message.fragment('{c}\'s', { c: card.controller });
        switch(card.location) {
            case 'dead pile':
            case 'discard pile':
            case 'shadows':
                return Message.fragment('returns {card} from {controller} {location} to {controller} hand', { card, controller, location: card.location });
            case 'being played':
                return Message.fragment('returns {card} to {controller} hand instead of placing it in {controller} discard pile', { card, controller });
            default:
                return Message.fragment('returns {card} to {controller} hand', { card, controller });
        }
    }

    canChangeGameState({ card }) {
        if(card.location === 'play area' && !LeavePlay.allow({ card })) {
            return false;
        }

        return ['dead pile', 'discard pile', 'play area', 'shadows', 'duplicate', 'being played'].includes(card.location);
    }

    createEvent({ card, allowSave = true }) {
        return MoveCardEventGenerator.createReturnCardToHandEvent({ card, allowSave });
    }
}

module.exports = new ReturnCardToHand();
