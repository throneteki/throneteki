const DrawCard = require('../../drawcard.js');

class TowerOfTheHand extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: event => 
                    event.card.controller === this.controller &&
                    this.game.anyPlotHasTrait('Winter')
            },
            limit: ability.limit.perPhase(1),
            target: {
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.isFaction('stark'),
                gameAction: 'stand'
            },
            message: '{player} kneels {source} to stand {target}'
        });
    }
}

TowerOfTheHand.code = '13062';

module.exports = TowerOfTheHand;
