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
                ...this.withUndo(context, this.propertyFactory(context))
            });
        });
    }

    // Clicking a used click-to-activate card refunds its costs (CardAction.deactivate), which
    // also ends the effects it created.
    withUndo(context, properties) {
        if (!context.ability?.isClickToActivate?.() || !context.ability.undoable) {
            return properties;
        }

        const condition = properties.condition;
        return {
            ...properties,
            condition: (effectContext) =>
                !context.abilityDeactivated && (!condition || condition(effectContext))
        };
    }
}

export default ApplyLastingEffect;
