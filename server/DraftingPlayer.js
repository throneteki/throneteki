const Spectator = require('./game/spectator');

class DraftingPlayer extends Spectator {
    constructor({ id, user, starterCards = [] }) {
        super(id, user);

        this.chosenCards = [];
        this.disconnectedAt = null;
        this.hand = [];
        this.hasChosen = false;
        this.left = false;
        this.starterCards = starterCards.map(cardQuantity => ({ count: cardQuantity.count, code: cardQuantity.cardCode }));
    }

    get deck() {
        // Clone objects from starter and chosen cards so that we don't unintentionally modify their counts
        const deckCards = this.starterCards.map(cardQuantity => ({ ...cardQuantity }));
        for(const cardQuantity of this.chosenCards) {
            const existingCardQuantity = deckCards.find(cq => cq.code === cardQuantity.code);
            if(existingCardQuantity) {
                existingCardQuantity.count += cardQuantity.count;
            } else {
                deckCards.push({ ...cardQuantity });
            }
        }
        return deckCards;
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
        const existingCardQuantity = this.chosenCards.find(cardQuantity => cardQuantity.code === card);
        if(existingCardQuantity) {
            existingCardQuantity.count += 1;
        } else {
            this.chosenCards.push({ count: 1, code: card });
        }
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
            draftedCards: this.deck,
            drawCards: [],
            eventId: event._id,
            faction: { value: 'baratheon' },
            plotCards: [],
            username: this.name
        };
    }

    isSpectator() {
        return false;
    }

    getConnectionState() {
        return {
            disconnected: !!this.disconnectedAt,
            id: this.id,
            left: this.left,
            name: this.name,
            user: {
                username: this.user.username
            }
        };
    }

    getCardState() {
        return {
            chosenCards: this.chosenCards,
            hand: this.hand,
            starterCards: this.starterCards
        };
    }
}

module.exports = DraftingPlayer;
