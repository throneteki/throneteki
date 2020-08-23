const GameAction = require('./GameAction');

class BypassByStealth extends GameAction {
    constructor() {
        super('bypassByStealth');
    }

    canChangeGameState({ challenge, source, target }) {
        return (
            source.isStealth() &&
            target.controller === challenge.defendingPlayer &&
            target.location === 'play area' &&
            target.getType() === 'character' &&
            !target.isStealth() &&
            target.allowGameAction(this.name)
        );
    }

    createEvent({ challenge, source, target }) {
        return this.event('onBypassedByStealth', { challenge, source, target }, event => {
            event.target.stealth = true;
        });
    }
}

module.exports = new BypassByStealth();
