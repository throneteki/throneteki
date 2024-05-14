import range from 'lodash.range';
import BaseStep from './basestep.js';

class ChooseGoldSourceAmounts extends BaseStep {
    constructor(game, spendParams, callback) {
        super(game);

        this.remainingAmount = spendParams.amount;
        this.player = spendParams.player;
        this.sources = this.player.getSpendableGoldSources(spendParams);
        this.spendParams = spendParams;
        this.callback = callback;
    }

    continue() {
        while (this.sources.length > 0) {
            if (this.remainingAmount === 0) {
                return;
            }

            this.currentSource = this.sources.shift();
            let currentAvailable = this.currentSource.gold;
            let maxAmount = Math.min(this.remainingAmount, currentAvailable);
            let minAmount = Math.max(0, this.remainingAmount - this.getMaxRemainingAvailable());

            if (this.sources.length > 0 && minAmount !== maxAmount) {
                let buttons = range(minAmount, maxAmount + 1)
                    .reverse()
                    .map((amount) => {
                        return { text: amount.toString(), method: 'payGold', arg: amount };
                    });
                this.game.promptWithMenu(this.player, this, {
                    activePrompt: {
                        menuTitle: `Select amount from ${this.currentSource.name}`,
                        buttons: buttons
                    }
                });
                return false;
            }

            this.payGold(this.player, maxAmount);
        }
    }

    getMaxRemainingAvailable() {
        return this.sources.reduce((sum, source) => sum + source.gold, 0);
    }

    payGold(player, amount) {
        this.remainingAmount -= amount;
        this.currentSource.modifyGold(-amount);

        if (this.remainingAmount === 0) {
            this.callback();
        }

        return true;
    }
}

export default ChooseGoldSourceAmounts;
