const DrawCard = require('../../drawcard.js');

class IronIslandsMarket extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain gold',
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                let gold = this.opponentDiscardPileHas8() ? 2 : 1;
                gold = this.game.addGold(context.player, gold);

                this.game.addMessage('{0} kneels {1} to gain {2} gold', context.player, this, gold);
            }
        });
    }

    opponentDiscardPileHas8() {
        let opponents = this.game.getOpponents(this.controller);
        return opponents.some((opponent) => opponent.discardPile.length >= 8);
    }
}

IronIslandsMarket.code = '06032';

module.exports = IronIslandsMarket;
