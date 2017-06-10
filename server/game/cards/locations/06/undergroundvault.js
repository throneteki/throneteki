const DrawCard = require('../../../drawcard.js');

class UndergroundVault extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel this card to gain gold',
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            handler: context => {
                let opponent = this.game.getOtherPlayer(this.controller);
                if(!opponent) {
                    return;
                }
                let gold = opponent && opponent.activePlot.getIncome() >= 5 ? 2 : 1;

                this.game.addGold(context.player, gold);
                this.game.addMessage('{0} kneels {1} to gain {2} gold', context.player, this, gold);
            }
        });
    }
}

UndergroundVault.code = '06046';

module.exports = UndergroundVault;
