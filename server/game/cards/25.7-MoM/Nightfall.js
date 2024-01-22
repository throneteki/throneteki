const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class Nightfall extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            match: card => card.hasTrait('House Harlaw'),
            effect: ability.effects.addKeyword('Renown')
        });

        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.parent && this.parent.isParticipating()
            },
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {costs.kneel} to have each player check for reserve',
            gameAction: GameActions.checkReserve()
        });
    }
}

Nightfall.code = '25522';
Nightfall.version = '1.1';

module.exports = Nightfall;
