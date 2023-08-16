const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class Insubordination extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallengeInitiated: event => event.challenge.isMatch({ initiatedAgainstPlayer: this.controller, attackingAlone: this.parent })
            },
            cost: ability.costs.sacrificeSelf(),
            message: {
                format: '{player} sacrifices {costs.sacrifice} to kill {parent}',
                args: { parent: () => this.parent }
            },
            gameAction: GameActions.kill({ card: this.parent })
        });
    }
}

Insubordination.code = '25551';
Insubordination.version = '1.0';

module.exports = Insubordination;
