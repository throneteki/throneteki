import AbilityMessage from './AbilityMessage.js';

const Durations = ['untilEndOfChallenge', 'untilEndOfPhase', 'untilEndOfRound'];

class DelayedEffect {
    constructor({ context, when, duration = 'untilEndOfPhase', message, gameAction }) {
        if (!Durations.includes(duration)) {
            throw new Error(`'${duration}' is not a valid delayed effect duration`);
        }

        this.context = context;
        this.when = when;
        this.duration = duration;
        this.message = AbilityMessage.create(message);
        this.gameAction = gameAction;
    }

    isTriggeredBy(event) {
        const condition = this.when[event.name];
        return !!condition && condition(event, this.context);
    }

    resolve(event) {
        const context = Object.assign(
            Object.create(Object.getPrototypeOf(this.context)),
            this.context,
            { event }
        );

        if (!this.gameAction.allow(context)) {
            return;
        }

        this.message.output(context.game, context);
        context.game.resolveGameAction(this.gameAction, context);
    }
}

export default DelayedEffect;
