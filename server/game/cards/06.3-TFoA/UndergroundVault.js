import DrawCard from '../../drawcard.js';

class UndergroundVault extends DrawCard {
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
