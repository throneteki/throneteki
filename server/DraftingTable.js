const lodashShuffle = require('lodash.shuffle');
const DraftingPlayer = require('./DraftingPlayer');
class DraftingTable {
    constructor({ playerNames, cardPool, deckService, event, numCardsPerRound = 15, numOfRounds, shuffle = lodashShuffle, starterCards }) {
        this.cubeDeck = shuffle(cardPool);
        this.currentRound = 1;
        this.deckService = deckService;
        this.event = event;
        this.numCardsPerRound = numCardsPerRound;
        this.numOfRounds = numOfRounds;
        this.players = playerNames.map(name => new DraftingPlayer({ name, starterCards }));
        this.rotateClockwise = true;
    }

    getPlayer(name) {
        return this.players.find(player => player.name === name);
    }

    drawHands() {
        for(const player of this.players) {
            const hand = this.cubeDeck.splice(0, this.numCardsPerRound);
            player.receiveNewHand(hand);
        }
    }

    chooseCard(playerName, card) {
        const player = this.getPlayer(playerName);

        player.chooseCard(card);

        if(!this.players.every(player => player.hasChosen)) {
            return;
        }

        if(this.players[0].hand.length === 0 && this.currentRound === this.numOfRounds) {
            this.saveDraftedDecks();
        } else if(this.players[0].hand.length === 0) {
            this.drawHands();
            this.currentRound += 1;
            this.rotateClockwise = !this.rotateClockwise;
        } else {
            this.passHands();
        }
    }

    passHands() {
        const rotatedHands = this.getRotatedHands();
        for(let i = 0; i < rotatedHands.length; ++i) {
            this.players[i].receiveNewHand(rotatedHands[i]);
        }
    }

    getRotatedHands() {
        const hands = this.players.map(player => player.hand);
        if(this.rotateClockwise) {
            const index = hands.length - 1;
            return [hands[index]].concat(hands.slice(0, index));
        }

        return hands.slice(1).concat([hands[0]]);
    }

    saveDraftedDecks() {
        for(const player of this.players) {
            this.deckService.create(player.formatDeck(this.event));
        }
    }
}

module.exports = DraftingTable;
