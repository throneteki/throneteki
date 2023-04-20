const GameAction = require('./GameAction');

class BypassByStealth extends GameAction {
    constructor() {
        super('bypassByStealth');
    }

    createEvent({ challenge, source, target }) {
        return this.event('onBypassedByStealth', { challenge, source, target }, event => {
            event.target.bypassedByStealth = true;
        });
    }
}

module.exports = new BypassByStealth();
