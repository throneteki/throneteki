import DelayedEffect from '../DelayedEffect.js';
import GameAction from './GameAction.js';

class AddDelayedEffect extends GameAction {
    constructor(properties) {
        super('delayedEffect');

        this.properties = properties;
    }

    allow() {
        return true;
    }

    createEvent(context) {
        return this.event('onDelayedEffectAdded', { source: context.source }, () => {
            context.game.addDelayedEffect(new DelayedEffect({ ...this.properties, context }));
        });
    }
}

export default AddDelayedEffect;
