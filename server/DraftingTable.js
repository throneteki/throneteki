const DisconnectCardTimeoutInSeconds = 120;

class DraftingTable {
    constructor({ draftCube, event, gameLog, messageBus, numOfRounds, players, saveDeck }) {
        this.currentRound = 0;
        this.draftFinished = false;
        this.event = event;
        this.gameLog = gameLog;
        this.messageBus = messageBus;
        this.numOfRounds = numOfRounds;
        this.packs = draftCube.generatePacks();
        this.players = players;
        this.rotateClockwise = false;
        this.saveDeck = saveDeck;
    }

    startRound() {
        this.gameLog.addAlert('startofround', 'Round {0} / {1}', this.currentRound + 1, this.numOfRounds);
        this.drawHands();
        this.currentRound += 1;
        this.rotateClockwise = !this.rotateClockwise;
    }

    getPlayer(name) {
        return this.players.find(player => player.name === name);
    }

    drawHands() {
        for(const player of this.players) {
            const hand = this.packs.shift();
            player.receiveNewHand(hand);
        }

        this.handleInactivePlayers();
    }

    handleInactivePlayers() {
        for(const player of this.players) {
            if(player.left) {
                this.handleLeftPlayer(player.name);
            }

            if(player.disconnectedAt) {
                this.handleDisconnectedPlayer(player.name);
            }
        }
    }

    handleLeftPlayer(playerName) {
        const player = this.getPlayer(playerName);

        if(player.hasChosen) {
            return;
        }

        player.chooseRandomCard();
        this.gameLog.addMessage('A random card is chosen for {0} because they left the table', player);

        this.executeNextDraftStep();
    }

    handleDisconnectedPlayer(playerName) {
        const player = this.getPlayer(playerName);

        if(player.hasChosen) {
            return;
        }

        this.gameLog.addMessage('A random card is will be chosen for {0} in {1} seconds', player, DisconnectCardTimeoutInSeconds);
        setTimeout(() => {
            if(player.hasChosen || !player.disconnectedAt) {
                return;
            }

            player.chooseRandomCard();
            this.gameLog.addMessage('A random card is chosen for {0} because they are disconnected', player);

            this.executeNextDraftStep();

            // Emit event to force game state to be updated
            this.messageBus.emit('onTimeExpired');
        }, DisconnectCardTimeoutInSeconds * 1000);
    }

    chooseCard(playerName, card) {
        const player = this.getPlayer(playerName);

        if(!player.hasChosen) {
            player.chooseCard(card);
            this.gameLog.addMessage('{0} chooses a card', player);
        }

        this.executeNextDraftStep();
    }

    executeNextDraftStep() {
        if(!this.players.every(player => player.hasChosen)) {
            return;
        }

        if(this.players[0].hand.length === 0 && this.currentRound === this.numOfRounds) {
            this.saveDraftedDecks();
        } else if(this.players[0].hand.length === 0) {
            this.startRound();
        } else {
            this.passHands();
        }
    }

    passHands() {
        const rotatedHands = this.getRotatedHands();
        for(let i = 0; i < rotatedHands.length; ++i) {
            this.players[i].receiveNewHand(rotatedHands[i]);
        }

        this.gameLog.addMessage('Each player passes their hands {0} ({1} cards remaining)', this.rotateClockwise ? 'clockwise' : 'counter-clockwise', this.players[0].hand.length);

        this.handleInactivePlayers();
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

        this.draftFinished = true;
        this.gameLog.addAlert('success', 'Drafting complete!');
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
