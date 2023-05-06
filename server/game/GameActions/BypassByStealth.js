const GameAction = require('./GameAction');

class BypassByStealth extends GameAction {
    constructor() {
        super('bypassByStealth');
    }

    canChangeGameState({ challenge, target }) {
        return !target.isStealth()
            && target.controller === challenge.defendingPlayer
            && target.location === 'play area'
            && target.getType() === 'character';
    }

    createEvent({ challenge, source, target }) {
        return this.event('onBypassedByStealth', { challenge, source, target }, event => {
            event.target.bypassedByStealth = true;

            source.untilEndOfChallenge(ability => ({
                match: target,
                effect: ability.effects.cannotBeDeclaredAsDefender()
            }));
        });
    }
}

module.exports = new BypassByStealth();
