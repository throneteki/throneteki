class DraftingTable {
    constructor({ draftCube, event, gameLog, numOfRounds, players, saveDeck }) {
        this.currentRound = 1;
        this.event = event;
        this.gameLog = gameLog;
        this.numOfRounds = numOfRounds;
        this.packs = draftCube.generatePacks();
        this.players = players;
        this.rotateClockwise = true;
        this.saveDeck = saveDeck;
        this.draftFinished = false;
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
            this.draftFinished = true;
            this.gameLog.addAlert('success', 'Drafting complete!');
        } else if(this.players[0].hand.length === 0) {
            this.drawHands();
            this.currentRound += 1;
            this.rotateClockwise = !this.rotateClockwise;
            this.gameLog.addAlert('startofround', 'Round {0} / {1}', this.currentRound, this.numOfRounds);
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
            draftFinished: this.draftFinished,
            players: this.players.map(player => ({
                hasChosen: player.hasChosen
            })),
            rotateClockwise: this.rotateClockwise
        };
    }
}

module.exports = DraftingTable;
