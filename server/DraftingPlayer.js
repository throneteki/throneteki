class DraftingPlayer {
    constructor({ name, starterCards }) {
        this.name = name;
        this.hand = [];
        this.deck = [...starterCards];
        this.hasChosen = false;
    }

    chooseCard(card) {
        if(this.hasChosen) {
            return;
        }

        const index = this.hand.indexOf(card);
        if(index === -1) {
            return;
        }

        this.hand.splice(index, 1);
        this.deck.push(card);
        this.hasChosen = true;
    }

    receiveNewHand(hand) {
        this.hand = hand;
        this.hasChosen = false;
    }

    formatDeck(event = {}) {
        const draftedCards = new Map();
        for(const card of this.deck) {
            if(draftedCards.has(card)) {
                draftedCards.set(card, draftedCards.get(card) + 1);
            } else {
                draftedCards.set(card, 1);
            }
        }

        return {
            name: `${event.name}: Drafted Deck`,
            bannerCards: [],
            draftedCards: [...draftedCards.entries()].map(([code, count]) => ({ code, count })),
            drawCards: [],
            eventId: event._id,
            faction: { value: 'baratheon' },
            plotCards: [],
            username: this.name
        };
    }
}

module.exports = DraftingPlayer;
