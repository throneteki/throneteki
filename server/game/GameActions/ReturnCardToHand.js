import Message from '../Message.js';
import GameAction from './GameAction.js';
import LeavePlay from './LeavePlay.js';
import MoveCardEventGenerator from './MoveCardEventGenerator.js';

class ReturnCardToHand extends GameAction {
    constructor() {
        super('returnToHand');
    }

    message({ card, context, location = card.location }) {
        let controller =
            card.controller === context.player
                ? 'their'
                : Message.fragment("{c}'s", { c: card.controller });
        switch (location) {
            case 'dead pile':
            case 'discard pile':
            case 'shadows':
                return Message.fragment(
                    'returns {card} from {controller} {location} to {controller} hand',
                    { card, controller, location }
                );
            case 'being played':
                return Message.fragment(
                    'returns {card} to {controller} hand instead of placing it in {controller} discard pile',
                    { card, controller }
                );
            default:
                return Message.fragment('returns {card} to {controller} hand', {
                    card,
                    controller
                });
        }
    }

    resultMessage(props, event) {
        return this.hasResult(event)
            ? this.message({ ...props, location: event.originalLocation })
            : '';
    }

    canChangeGameState({ card }) {
        if (card.location === 'play area' && !LeavePlay.allow({ card })) {
            return false;
        }

        return [
            'dead pile',
            'discard pile',
            'play area',
            'shadows',
            'duplicate',
            'being played',
            'underneath'
        ].includes(card.location);
    }

    createEvent({ card, allowSave = true }) {
        return MoveCardEventGenerator.createReturnCardToHandEvent({ card, allowSave });
    }
}

export default new ReturnCardToHand();
