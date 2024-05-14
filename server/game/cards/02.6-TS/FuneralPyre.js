const DrawCard = require('../../drawcard.js');
const TextHelper = require('../../TextHelper');

class FuneralPyre extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCharacterKilled: (event) =>
                    (event.cardStateWhenKilled.hasTrait('Lord') ||
                        event.cardStateWhenKilled.hasTrait('Lady')) &&
                    this.controller.canDraw()
            },
            cost: ability.costs.kneelFactionCard(),
            handler: () => {
                let cards = this.controller.drawCardsToHand(3).length;
                this.game.addMessage(
                    '{0} uses {1} to draw {2}',
                    this.controller,
                    this,
                    TextHelper.count(cards, 'card')
                );
            }
        });
    }
}

FuneralPyre.code = '02114';

module.exports = FuneralPyre;
