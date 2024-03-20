const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class Insubordination extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallengeInitiated: event => event.challenge.isMatch({ initiatedAgainstPlayer: this.controller, attackingAlone: this.parent })
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {costs.kneel} to kill {parent}',
                args: { parent: () => this.parent }
            },
            gameAction: GameActions.kill(() => ({ card: this.parent }))
        });
    }
}

Insubordination.code = '25030';

module.exports = Insubordination;
