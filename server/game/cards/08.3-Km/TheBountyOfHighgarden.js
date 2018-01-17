const DrawCard = require('../../drawcard.js');

class TheBountyOfHighgarden extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Gain 5 gold',
            cannotBeCanceled: true,
            handler: context => {
                this.game.addGold(context.player, 5);
                this.game.addMessage('{0} plays {1} to gain 5 gold', context.player, this);
            }
        });
    }
}

TheBountyOfHighgarden.code = '08044';

module.exports = TheBountyOfHighgarden;
