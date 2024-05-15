import BaseCardSelector from './BaseCardSelector.js';

class MaxStatCardSelector extends BaseCardSelector {
    constructor(properties) {
        super(properties);

        this.cardStat = properties.cardStat;
        this.maxStat = properties.maxStat;
    }

    canTarget(card, context, selectedCards) {
        return (
            super.canTarget(card, context, selectedCards) && this.cardStat(card) <= this.maxStat()
        );
    }

    wouldExceedLimit(selectedCards, card) {
        let currentStatSum = selectedCards.reduce((sum, c) => sum + this.cardStat(c), 0);

        return this.cardStat(card) + currentStatSum > this.maxStat();
    }

    hasReachedLimit(selectedCards) {
        let currentStatSum = selectedCards.reduce((sum, c) => sum + this.cardStat(c), 0);
        return currentStatSum >= this.maxStat();
    }
}

export default MaxStatCardSelector;
