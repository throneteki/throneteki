const defaultProperties = {
    numCards: 1,
    cardCondition: () => true,
    cardType: ['attachment', 'character', 'event', 'location'],
    gameAction: 'target',
    multiSelect: false
};

class CardSelector {
    static for(properties) {
        properties = Object.assign({}, defaultProperties, properties);

        if(properties.maxStat) {
            return new MaxStatCardSelector(properties);
        }

        if(properties.numCards === 1 && !properties.multiSelect) {
            return new SingleCardSelector(properties);
        }

        if(properties.numCards === 0) {
            return new UnlimitedCardSelector(properties);
        }

        return new UpToXCardSelector(properties.numCards, properties);
    }

    constructor(properties) {
        this.cardCondition = properties.cardCondition;
        this.cardType = properties.cardType;
        this.gameAction = properties.gameAction;

        if(!Array.isArray(properties.cardType)) {
            this.cardType = [properties.cardType];
        }
    }

    canTarget(card, context) {
        return (
            this.cardType.includes(card.getType()) &&
            this.cardCondition(card, context) &&
            card.allowGameAction(this.gameAction)
        );
    }

    defaultActivePromptTitle() {
        return 'Select characters';
    }

    automaticFireOnSelect() {
        return false;
    }

    wouldExceedLimit(selectedCards, card) { // eslint-disable-line no-unused-vars
        return false;
    }

    hasReachedLimit(selectedCards) { // eslint-disable-line no-unused-vars
        return false;
    }

    formatSelectParam(cards) {
        return cards;
    }
}

class SingleCardSelector extends CardSelector {
    constructor(properties) {
        super(properties);

        this.numCards = 1;
    }

    defaultActivePromptTitle() {
        return 'Select a character';
    }

    automaticFireOnSelect() {
        return true;
    }

    hasReachedLimit(selectedCards) {
        return selectedCards.length >= this.numCards;
    }

    formatSelectParam(cards) {
        return cards[0];
    }
}

class UpToXCardSelector extends CardSelector {
    constructor(numCards, properties) {
        super(properties);

        this.numCards = numCards;
    }

    defaultActivePromptTitle() {
        return this.numCards === 1 ? 'Select a character' : `Select ${this.numCards} characters`;
    }

    hasReachedLimit(selectedCards) {
        return selectedCards.length >= this.numCards;
    }
}

class UnlimitedCardSelector extends CardSelector {
    hasReachedLimit() {
        return false;
    }
}

class MaxStatCardSelector extends CardSelector {
    constructor(properties) {
        super(properties);

        this.cardStat = properties.cardStat;
        this.maxStat = properties.maxStat;
    }

    canTarget(card, context) {
        return super.canTarget(card, context) && this.cardStat(card) <= this.maxStat();
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

module.exports = CardSelector;
