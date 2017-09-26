const defaultProperties = {
    numCards: 1,
    cardCondition: () => true,
    cardType: ['attachment', 'character', 'event', 'location'],
    gameAction: 'target',
    multiSelect: false
};

class CardSelector {
    constructor(properties) {
        properties = Object.assign({}, defaultProperties, properties);


        this.gameAction = properties.gameAction;
        this.numCards = properties.numCards;
        this.multiSelect = properties.multiSelect;

        if(Array.isArray(properties.cardType)) {
            this.cardType = properties.cardType;
        } else {
            this.cardType = [properties.cardType];
        }

        if(properties.maxStat && properties.cardStat) {
            this.cardCondition = this.createMaxStatCardCondition(properties);
        } else {
            this.cardCondition = properties.cardCondition;
        }

        this.properties = properties;
    }

    createMaxStatCardCondition(properties) {
        return (card, context) => {
            if(!properties.cardCondition(card, context)) {
                return false;
            }

            return properties.cardStat(card) <= properties.maxStat();
        };
    }

    canTarget(card, context) {
        return (
            this.cardType.includes(card.getType()) &&
            this.cardCondition(card, context) &&
            card.allowGameAction(this.gameAction)
        );
    }

    // TODO: Candidate for polymorphism
    automaticFireOnSelect() {
        return this.properties.numCards === 1 && !this.properties.multiSelect;
    }

    // TODO: candidate for polymorphism
    wouldExceedLimit(selectedCards, card) {
        if(!this.properties.maxStat) {
            return false;
        }

        let currentStatSum = selectedCards.reduce((sum, c) => sum + this.properties.cardStat(c), 0);

        return this.properties.cardStat(card) + currentStatSum > this.properties.maxStat();
    }

    // TODO: Candidate for polymorphism
    hasReachedLimit(selectedCards) {
        return !this.isUnlimited() && selectedCards.length >= this.properties.numCards;
    }

    // TODO: Candidate for polymorphism
    isUnlimited() {
        return this.properties.numCards === 0;
    }

    // TODO: Candidate for polymorphism
    formatSelectParam(cards) {
        if(this.properties.numCards === 1 && !this.properties.multiSelect) {
            return cards[0];
        }

        return cards;
    }
}

module.exports = CardSelector;
