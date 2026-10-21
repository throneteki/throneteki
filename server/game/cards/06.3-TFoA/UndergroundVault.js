import DrawCard from '../../drawcard.js';

class UndergroundVault extends DrawCard {
    // Underground Vault (06046)
    // Limited.
    // Marshaling Action: Kneel Underground Vault to gain 1 gold. (2 gold instead if the gold value
    // on an opponent's revealed plot card is 5 or higher.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain gold',
            phase: 'marshal',
            condition: () => this.controller.canGainGold(),
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                let gold = this.opponentHasIncomeOf5() ? 2 : 1;
                gold = this.game.addGold(context.player, gold);

                this.game.addMessage('{0} kneels {1} to gain {2} gold', context.player, this, gold);
            }
        });
    }

    opponentHasIncomeOf5() {
        let opponents = this.game.getOpponents(this.controller);
        return opponents.some((opponent) => opponent.activePlot.getIncome() >= 5);
    }
}

UndergroundVault.code = '06046';

export default UndergroundVault;
