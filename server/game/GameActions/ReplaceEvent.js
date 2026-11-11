import GameAction from './GameAction.js';

/**
 * "Instead": the event still resolves, but its effect is the replacement game action.
 */
class ReplaceEvent extends GameAction {
    constructor() {
        super('replaceEvent');
    }

    message({ replacement, context }) {
        return replacement.message(context);
    }

    canChangeGameState({ event, replacement, context }) {
        return !!event && !event.cancelled && replacement.allow(context);
    }

    createEvent({ event, replacement, context }) {
        return this.event('__PLACEHOLDER_EVENT__', {}, () => {
            event.replaceHandler(() => context.game.resolveGameAction(replacement, context));
        });
    }
}

export default new ReplaceEvent();
