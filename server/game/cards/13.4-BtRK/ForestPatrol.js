const DrawCard = require('../../drawcard');

class ForestPatrol extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put into play',
            location: 'shadows',
            cost: ability.costs.kneel(
                (card) => card.isFaction('thenightswatch') && card.getType() === 'location'
            ),
            condition: (context) => context.player.canPutIntoPlay(this, 'outOfShadows'),
            message: {
                format: '{player} uses {source} and kneels {location} to put {source} into play from shadows',
                args: { location: (context) => context.costs.kneel }
            },
            handler: (context) => {
                context.player.putIntoPlay(this);
            }
        });
    }
}

ForestPatrol.code = '13065';

module.exports = ForestPatrol;
