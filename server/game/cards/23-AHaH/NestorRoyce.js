const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class NestorRoyce extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.getOpponents(this.controller).every(player => player.getTotalInitiative() > this.controller.getTotalInitiative()),
            match: () => this,
            effect: ability.effects.addKeyword('Renown')
        });

        this.reaction({
            when: {
                afterChallenge: event => this.isAttacking() && event.challenge.isMatch({ winner: this.controller })
            },
            cost: ability.costs.kneel({ type: 'location', faction: 'neutral', printedCostOrHigher: 1 }),
            message: {
                format: '{player} uses {source} and kneels {kneel} to stand {source}',
                args: { kneel: context => context.costs.kneel }
            },
            gameAction: GameActions.standCard({ card: this })
        });
    }
}

NestorRoyce.code = '23024';

module.exports = NestorRoyce;
