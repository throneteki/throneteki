const DrawCard = require('../../drawcard.js');

class KayceMerchant extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onIncomeCollected: (event) =>
                    event.player === this.controller && this.controller.canGainGold()
            },
            cost: ability.costs.discardGold(),
            handler: () => {
                let gold = this.game.addGold(this.controller, 2);
                this.game.addMessage(
                    '{0} discards 1 gold from {1} to gain {2} gold',
                    this.controller,
                    this,
                    gold
                );
            }
        });
    }
}

KayceMerchant.code = '06089';

module.exports = KayceMerchant;
