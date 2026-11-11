import GameAction from './GameAction.js';
import Message from '../Message.js';

class InitiateWhenRevealed extends GameAction {
    constructor() {
        super('initiateWhenRevealed');
    }

    message({ plot }) {
        return Message.fragment('initiates the When Revealed ability of {plot}', { plot });
    }

    canChangeGameState({ plot }) {
        return !!plot && !!plot.getWhenRevealedAbility();
    }

    createEvent({ plot, player, context }) {
        player = player || context.player;
        return this.event('onWhenRevealedInitiated', { plot, player }, (event) => {
            const whenRevealed = event.plot.getWhenRevealedAbility();
            const whenRevealedContext = whenRevealed.createContext(context.event);
            whenRevealedContext.player = event.player;
            context.game.resolveAbility(whenRevealed, whenRevealedContext);
        });
    }
}

export default new InitiateWhenRevealed();
