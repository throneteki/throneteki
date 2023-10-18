const sample = require('lodash.sample');
const Spectator = require('./game/spectator');
const PlayerPromptState = require('./game/playerpromptstate.js');

class DraftingPlayer extends Spectator {
    constructor({ id, user, starterCards = [] }) {
        super(id, user);

        this.chosenCards = [];
        this.disconnectedAt = null;
        this.hand = [];
        this.hasChosen = false;
        this.left = false;
        this.starterCards = starterCards.map(cardQuantity => ({ count: cardQuantity.count, code: cardQuantity.cardCode }));
        this.chosenCardIndex = -1;
        this.promptState = new PlayerPromptState();
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

        this.chosenCardIndex = this.hand.indexOf(card);
    }

    confirmChosenCard() {
        if(this.chosenCardIndex < 0) {
            return;
        }

        this.hasChosen = true;
    }

    addChosenCardToDeck() {
        if(this.chosenCardIndex < 0) {
            return;
        }

        //splice returns an array containing the removed item, therefore select [0]
        let chosenCard = this.hand.splice(this.chosenCardIndex, 1)[0];
        const existingCardQuantity = this.chosenCards.find(cardQuantity => cardQuantity.code === chosenCard);
        if(existingCardQuantity) {
            existingCardQuantity.count += 1;
        } else {
            this.chosenCards.push({ count: 1, code: chosenCard });
        }
    }

    chooseRandomCard() {
        if(!this.hand || this.hand.length === 0) {
            return;
        }

        const card = sample(this.hand);
        this.chooseCard(card);
        this.confirmChosenCard();
    }

    cancelChosenCard() {
        if(!this.hasChosen) {
            return;
        }
        this.chosenCardIndex = -1;
        this.hasChosen = false;
    }

    receiveNewHand(hand) {
        this.hand = hand;
        this.chosenCardIndex = -1;
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
            bannerCards: [],
            deckName: `${event.name}: Drafted Deck`,
            draftedCards: this.deck,
            draftCubeId: event.draftOptions.draftCubeId,
            drawCards: [],
            eventId: event._id,
            faction: { value: 'baratheon' },
            format: 'draft',
            plotCards: [],
            username: this.name
        };
    }

    isSpectator() {
        return false;
    }

    currentPrompt() {
        return this.promptState.getState();
    }

    setPrompt(prompt) {
        this.promptState.setPrompt(prompt);
    }

    cancelPrompt() {
        this.promptState.cancelPrompt();
    }

    getConnectionState({ fullData = false }) {
        const user = fullData ? this.user : { username: this.user.username };
        return {
            disconnected: !!this.disconnectedAt,
            id: this.id,
            left: this.left,
            name: this.name,
            user
        };
    }

    getPlayerState() {
        let promptState = this.promptState.getState();
        let state = {
            chosenCardIndex: this.chosenCardIndex,
            deck: this.deck,
            hand: this.hand,
            hasChosen: this.hasChosen
        };
        return Object.assign(state, promptState);
    }
}

module.exports = DraftingPlayer;
