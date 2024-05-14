const DrawCard = require('../../drawcard.js');

class EastwatchCarpenter extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onIncomeCollected: (event) =>
                    event.player === this.controller &&
                    this.getGoldBonus() >= 1 &&
                    this.controller.canGainGold()
            },
            handler: () => {
                let gold = this.getGoldBonus();
                gold = this.game.addGold(this.controller, gold);

                this.game.addMessage('{0} uses {1} to gain {2} gold', this.controller, this, gold);
            }
        });
    }

    getGoldBonus() {
        let numCards = this.controller.getNumberOfCardsInPlay((card) => {
            return card.isFaction('thenightswatch') && card.getType() === 'location';
        });

        return Math.floor(numCards / 2);
    }
}

EastwatchCarpenter.code = '06005';

module.exports = EastwatchCarpenter;
