import GameAction from './GameAction.js';

class ApplyLastingEffect extends GameAction {
    constructor(propertyFactory) {
        super('lastingEffect');

        this.propertyFactory = propertyFactory;
    }

    allow() {
        return true;
    }

    createEvent(context) {
        return this.event('onLastingEffectApplied', { source: context.source }, () => {
            context.game.addEffect(context.source, {
                location: 'any',
                ...this.propertyFactory(context)
            });
        });
    }
}

export default ApplyLastingEffect;
