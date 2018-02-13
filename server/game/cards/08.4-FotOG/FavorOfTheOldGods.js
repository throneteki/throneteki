const DrawCard = require('../../drawcard.js');

class FavorOfTheOldGods extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addTrait('Old Gods')
        });

        this.action({
            title: 'Stand attached character',
            condition: () => this.parent.kneeled && !this.controller.anyCardsInPlay(card => !card.isFaction('stark')),
            cost: ability.costs.kneelSelf(),
            handler: context => {
                this.parent.controller.standCard(this.parent);
                this.game.addMessage('{0} kneels {1} to stand {2}', context.player, this, this.parent);
            }
        });
    }
}

FavorOfTheOldGods.code = '08062';

module.exports = FavorOfTheOldGods;
