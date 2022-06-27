const GameAction = require('./GameAction');
const NullableGameAction = require('./NullableGameAction');
const AbilityMessage = require('../AbilityMessage');

class IfGameAction extends GameAction {
    constructor({ condition, thenAction, elseAction = NullableGameAction }) {
        super('if');

        this.condition = condition;
        this.thenAction = this.buildAction(thenAction);
        this.elseAction = this.buildAction(elseAction);
    }

    buildAction(action) {
        if(!action.gameAction) {
            return {
                gameAction: action,
                message: AbilityMessage.create(null)
            };
        }
        return {
            gameAction: action.gameAction,
            message: AbilityMessage.create(action.message)
        };
    }

    message(context) {
        const action = this.getAction(context);
        return action.gameAction.message(context);
    }

    allow(context) {
        const action = this.getAction(context);
        return action.gameAction.allow(context);
    }

    createEvent(context) {
        const action = this.getAction(context);
        action.message.output(context.game, { ...context, gameAction: action.gameAction });
        return action.gameAction.createEvent(context);
    }

    getAction(context) {
        return this.condition(context) ? this.thenAction : this.elseAction;
    }
}

module.exports = IfGameAction;
