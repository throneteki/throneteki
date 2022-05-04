const GameAction = require('./GameAction');
const NullableGameAction = require('./NullableGameAction');

class IfGameAction extends GameAction {
    constructor({ condition, thenAction, elseAction = NullableGameAction }) {
        super('if');

        this.condition = condition;
        this.thenAction = thenAction;
        this.elseAction = elseAction;
    }

    message(context) {
        if(this.condition(context)) {
            return this.thenAction.message(context);
        }

        return this.elseAction.message(context);
    }

    allow(context) {
        if(this.condition(context)) {
            return this.thenAction.allow(context);
        }

        return this.elseAction.allow(context);
    }

    createEvent(context) {
        if(this.condition(context)) {
            return this.thenAction.createEvent(context);
        }

        return this.elseAction.createEvent(context);
    }
}

module.exports = IfGameAction;
