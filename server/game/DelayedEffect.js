import AbilityMessage from './AbilityMessage.js';
import SimultaneousEvents from './SimultaneousEvents.js';

const Durations = [
    'custom',
    'untilEndOfChallenge',
    'untilEndOfPhase',
    'untilEndOfRound',
    'untilTriggered'
];

class DelayedEffect {
    constructor({
        context,
        when,
        until = {},
        duration = 'untilEndOfPhase',
        message,
        gameAction,
        title,
        group,
        groupTitle
    }) {
        if (!Durations.includes(duration)) {
            throw new Error(`'${duration}' is not a valid delayed effect duration`);
        }

        this.context = context;
        this.when = when;
        this.until = until;
        this.duration = duration;
        this.message = AbilityMessage.create(message);
        this.gameAction = gameAction;
        this.title = title;
        this.group = group;
        this.groupTitle = groupTitle;
    }

    static resolveGroup(group) {
        const simultaneous = new SimultaneousEvents();
        for (const { delayedEffect, event } of group) {
            const context = delayedEffect.createContext(event);
            if (delayedEffect.gameAction.allow(context)) {
                delayedEffect.message.output(context.game, context);
                simultaneous.addChildEvent(delayedEffect.gameAction.createEvent(context));
            }
        }
        if (simultaneous.childEvents.length) {
            group[0].delayedEffect.context.game.resolveEvent(simultaneous);
        }
    }

    isTriggeredBy(event) {
        const condition = this.when[event.name];
        return !!condition && condition(event, this.context);
    }

    isExpiredBy(event) {
        const condition = this.until[event.name];
        return !!condition && condition(event, this.context);
    }

    createContext(event) {
        return Object.assign(Object.create(Object.getPrototypeOf(this.context)), this.context, {
            event
        });
    }

    canResolve(event) {
        return this.gameAction.allow(this.createContext(event));
    }

    resolve(event) {
        const context = this.createContext(event);

        if (!this.gameAction.allow(context)) {
            return;
        }

        this.message.output(context.game, context);
        context.game.resolveGameAction(this.gameAction, context);
    }
}

export default DelayedEffect;
