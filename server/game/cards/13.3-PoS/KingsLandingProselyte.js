const DrawCard = require('../../drawcard');

class KingsLandingProselyte extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put into play',
            location: 'shadows',
            cost: ability.costs.kill((card) => !card.kneeled && card.isFaction('greyjoy')),
            condition: (context) => context.player.canPutIntoPlay(this, 'outOfShadows'),
            message: {
                format: '{player} uses {source} and kills {killed} to put {source} into play from shadows',
                args: { killed: (context) => context.costs.kill }
            },
            handler: (context) => {
                context.player.putIntoPlay(this);
            }
        });
    }
}

KingsLandingProselyte.code = '13051';

module.exports = KingsLandingProselyte;
