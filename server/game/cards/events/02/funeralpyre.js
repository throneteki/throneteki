const DrawCard = require('../../../drawcard.js');

class FuneralPyre extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCharacterKilled: event => event.card.hasTrait('Lord') || event.card.hasTrait('Lady')
            },
            cost: ability.costs.kneelFactionCard(),
            handler: () => {
                this.controller.drawCardsToHand(3);
                this.game.addMessage('{0} uses {1} to draw 3 cards',
                                     this.controller, this);
            }
        });
    }
}

FuneralPyre.code = '02114';

module.exports = FuneralPyre;
