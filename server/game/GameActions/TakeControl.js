import GameAction from './GameAction.js';
import Message from '../Message.js';

class TakeControl extends GameAction {
    constructor() {
        super('takeControl');
    }

    message({ card }) {
        return Message.fragment('takes control of {card}', { card });
    }

    canChangeGameState({ player, card }) {
        if (!player || card.controller === player) {
            return false;
        }

        if (card.location !== 'play area') {
            return player.canPutIntoPlay(card);
        }

        return player.canControl(card);
    }

    createEvent({ player, card, context, source = context && context.source }) {
        return this.event(
            'onCardTakenControl',
            { card, oldController: card.controller, player, source },
            (event) => {
                event.card.game.changeController(event.player, event.card, event.source);
            }
        );
    }
}

export default new TakeControl();
