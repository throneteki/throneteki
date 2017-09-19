const DrawCard = require('../../drawcard.js');

class TheGoldroad extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });

        this.action({
            title: 'Gain 1 gold',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            handler: context => {
                this.game.addGold(context.player, 1);
                this.game.addMessage('{0} kneels {1} to gain 1 gold', context.player, this);
            }
        });
    }
}

TheGoldroad.code = '06110';

module.exports = TheGoldroad;
