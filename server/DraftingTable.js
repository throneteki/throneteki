const DraftingPlayer = require('./DraftingPlayer');
class DraftingTable {
    constructor({ playerNames, draftCube, event, numOfRounds, saveDeck, starterCards }) {
        this.currentRound = 1;
        this.event = event;
        this.numOfRounds = numOfRounds;
        this.packs = draftCube.generatePacks();
        this.players = playerNames.map(name => new DraftingPlayer({ name, starterCards }));
        this.rotateClockwise = true;
        this.saveDeck = saveDeck;
    }

    getPlayer(name) {
        return this.players.find(player => player.name === name);
    }

    drawHands() {
        for(const player of this.players) {
            const hand = this.packs.shift();
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
            this.saveDeck(player.formatDeck(this.event));
        }
    }
}

module.exports = DraftingTable;
