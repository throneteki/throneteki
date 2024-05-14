const DrawCard = require('../../drawcard.js');

class SouthronEscort extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put into play',
            condition: () => this.controller.canPutIntoPlay(this, 'outOfShadows'),
            location: 'shadows',
            cost: ability.costs.discardFromShadows((card) => card !== this),
            message: {
                format: '{player} uses {source} and discards {discardedCard} from shadows to put {source} into play from shadows',
                args: { discardedCard: (context) => context.costs.discardFromShadows }
            },
            handler: (context) => {
                context.player.putIntoPlay(this);
            }
        });
    }
}

SouthronEscort.code = '13015';

module.exports = SouthronEscort;
