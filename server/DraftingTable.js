class DraftingTable {
    constructor({ draftCube, event, numOfRounds, players, saveDeck }) {
        this.currentRound = 1;
        this.event = event;
        this.numOfRounds = numOfRounds;
        this.packs = draftCube.generatePacks();
        this.players = players;
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

    getState(playerName) {
        const activePlayer = this.getPlayer(playerName);
        return {
            activePlayer: activePlayer && activePlayer.getCardState(),
            currentRound: this.currentRound,
            players: this.players.map(player => ({
                hasChosen: player.hasChosen
            })),
            rotateClockwise: this.rotateClockwise
        };
    }
}

module.exports = DraftingTable;
