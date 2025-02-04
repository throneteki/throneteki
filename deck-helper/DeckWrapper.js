class DeckWrapper {
    constructor(rawDeck) {
        this.agenda = rawDeck.agenda;
        this.bannerCards = rawDeck.bannerCards || [];
        this.draftedCards = rawDeck.draftedCards || [];
        this.drawCards = rawDeck.drawCards;
        this.eventId = rawDeck.eventId;
        this.faction = rawDeck.faction;
        this.format = rawDeck.format || 'joust';
        this.plotCards = rawDeck.plotCards;

        this.agendas = [this.agenda, ...this.bannerCards].filter((agenda) => !!agenda);

        this.drawCount = this.countDrawCards();
        this.plotCount = this.countPlotCards();
    }

    getCardCountsByName() {
        const cardCountByName = {};
        for (const cardQuantity of this.getAllCards()) {
            cardCountByName[cardQuantity.card.name] = cardCountByName[cardQuantity.card.name] || {
                name: cardQuantity.card.name,
                type: cardQuantity.card.type,
                limit: cardQuantity.card.deckLimit,
                count: 0
            };
            cardCountByName[cardQuantity.card.name].count += cardQuantity.count;
        }
        return cardCountByName;
    }

    getCardsIncludedInDeck() {
        return [...this.drawCards, ...this.plotCards].map((cardQuantity) => cardQuantity.card);
    }

    getUniqueCards() {
        return this.getCardsIncludedInDeck().concat(this.agendas);
    }

    getAllCards() {
        return [...this.getAgendaCardsWithCounts(), ...this.drawCards, ...this.plotCards];
    }

    getAgendaCardsWithCounts() {
        return this.agendas.map((agenda) => ({ card: agenda, count: 1 }));
    }

    countDrawCards(predicate = () => true) {
        return this.getDeckCount(
            this.drawCards.filter((cardQuantity) => predicate(cardQuantity.card))
        );
    }

    countPlotCards(predicate = () => true) {
        return this.getDeckCount(
            this.plotCards.filter((cardQuantity) => predicate(cardQuantity.card))
        );
    }

    countCards(predicate = () => true) {
        return this.getDeckCount(
            this.getAllCards().filter((cardQuantity) => predicate(cardQuantity.card))
        );
    }

    getDeckCount(cardEntries) {
        let count = 0;

        for (const cardEntry of cardEntries) {
            count += cardEntry.count;
        }

        return count;
    }
}

export default DeckWrapper;
