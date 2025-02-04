class RestrictedList {
    constructor(rules) {
        this.rules = rules;
        this.pods = rules.pods || [];
    }

    validate(deck) {
        const cards = deck.getUniqueCards();
        const restrictedCardsOnList = cards.filter((card) =>
            this.rules.restricted.includes(card.code)
        );
        const bannedCardsOnList = cards.filter((card) => this.rules.banned.includes(card.code));

        const errors = [];

        if (this.rules.format === 'draft' && deck.eventId !== this.rules._id) {
            errors.push(`${this.rules.name} - Deck was not created for this event`);
        }

        if (restrictedCardsOnList.length > 1) {
            errors.push(
                `${this.rules.name} - Contains more than 1 card on the restricted list: ${restrictedCardsOnList.map((card) => card.name).join(', ')}`
            );
        }

        if (bannedCardsOnList.length > 0) {
            errors.push(
                `${this.rules.name} - Contains cards on the banned list: ${bannedCardsOnList.map((card) => card.name).join(', ')}`
            );
        }

        const poddedCardsOnList = [];
        for (let i = 0; i < this.pods.length; i++) {
            const pod = this.pods[i];
            const validation = pod.restricted
                ? this.validateRestrictedPods({ pod, cards, number: i + 1 })
                : this.validateAnyCardPod({ pod, cards, number: i + 1 });
            errors.push(...validation.errors);
            poddedCardsOnList.push(...validation.cards);
        }

        return {
            name: this.rules.name,
            valid: errors.length === 0,
            restrictedRules: restrictedCardsOnList.length <= 1,
            errors: errors,
            restrictedCards: restrictedCardsOnList,
            bannedCards: bannedCardsOnList,
            poddedCards: poddedCardsOnList
        };
    }

    validateRestrictedPods({ pod, cards, number }) {
        const validation = {
            errors: [],
            cards: []
        };

        const restrictedCard = cards.find((card) => card.code === pod.restricted);

        if (!restrictedCard) {
            return validation;
        }

        const cardsOnList = cards.filter((card) => pod.cards.includes(card.code));
        if (cardsOnList.length > 0) {
            validation.errors.push(
                `${this.rules.name} - Contains cards that cannot be used with "${restrictedCard.name}" from pod #${number}: ${cardsOnList.map((card) => card.name).join(', ')}`
            );
            validation.cards.push(...cardsOnList);
        }

        return validation;
    }

    validateAnyCardPod({ pod, cards, number }) {
        const validation = {
            errors: [],
            cards: []
        };

        const cardsOnList = cards.filter((card) => pod.cards.includes(card.code));
        if (cardsOnList.length > 1) {
            validation.errors.push(
                `${this.rules.name} - Contains multiple cards from pod #${number}: ${cardsOnList.map((card) => card.name).join(', ')}`
            );
            validation.cards.push(...cardsOnList);
        }

        return validation;
    }
}

export default RestrictedList;
