import GameAction from './GameAction.js';

class BypassByStealth extends GameAction {
    constructor() {
        super('bypassByStealth');
    }

    canChangeGameState({ challenge, card }) {
        return (
            !card.isStealth() &&
            card.controller === challenge.defendingPlayer &&
            card.location === 'play area' &&
            card.getType() === 'character'
        );
    }

    createEvent({ challenge, source, card }) {
        return this.event('onBypassedByStealth', { challenge, source, target: card }, (event) => {
            event.target.bypassedByStealth = true;

            event.source.untilEndOfChallenge((ability) => ({
                match: event.target,
                effect: ability.effects.cannotBeDeclaredAsDefender()
            }));
        });
    }
}

export default new BypassByStealth();
