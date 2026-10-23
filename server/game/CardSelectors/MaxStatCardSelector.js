import BaseCardSelector from './BaseCardSelector.js';

class MaxStatCardSelector extends BaseCardSelector {
    constructor(properties) {
        super(properties);

        this.cardStat = properties.cardStat;
        this.maxStat = properties.maxStat;
    }

    canTarget(card, context, selectedCards) {
        return (
            super.canTarget(card, context, selectedCards) &&
            this.cardStat(card) <= this.maxStat(context)
        );
    }

    wouldExceedLimit(selectedCards, card, context) {
        let currentStatSum = selectedCards.reduce((sum, c) => sum + this.cardStat(c), 0);

        return this.cardStat(card) + currentStatSum > this.maxStat(context);
    }

    hasReachedLimit(selectedCards, numPlayers, context) {
        let currentStatSum = selectedCards.reduce((sum, c) => sum + this.cardStat(c), 0);
        return currentStatSum >= this.maxStat(context);
    }
}

export default MaxStatCardSelector;
