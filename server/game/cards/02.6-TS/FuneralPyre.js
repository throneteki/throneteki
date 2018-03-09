const DrawCard = require('../../drawcard.js');

class FuneralPyre extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCharacterKilled: event =>
                    (event.cardStateWhenKilled.hasTrait('Lord') || event.cardStateWhenKilled.hasTrait('Lady')) &&
                    this.controller.canDraw()
            },
            cost: ability.costs.kneelFactionCard(),
            handler: () => {
                let cards = this.controller.drawCardsToHand(3).length;
                this.game.addMessage('{0} uses {1} to draw {2} {3}',
                    this.controller, this, cards, cards > 1 ? 'cards' : 'card');
            }
        });
    }
}

FuneralPyre.code = '02114';

module.exports = FuneralPyre;
