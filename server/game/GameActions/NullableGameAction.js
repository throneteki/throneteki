const GameAction = require('./GameAction');
const NullEvent = require('../NullEvent');

class NullableGameAction extends GameAction {
    constructor() {
        super('null');
    }

    message() {
        return '';
    }

    allow() {
        return false;
    }

    createEvent() {
        return new NullEvent();
    }
}

module.exports = new NullableGameAction();
