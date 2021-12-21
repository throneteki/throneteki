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
        //first increase the round counter, then draw new hands to prevent a stale game with only left players from
        //creating an endless loop
        this.currentRound += 1;
        this.rotateClockwise = !this.rotateClockwise;
        this.drawHands();
    }

    getPlayer(name) {
        return this.players.find(player => player.name === name);
    }

    drawHands() {
        for(const player of this.players) {
            const hand = this.packs.shift();
            player.receiveNewHand(hand);
            this.setSelectCardPrompt(player);
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

        if(!player.hasChosen && card) {
            player.chooseCard(card);
        }
        this.setSelectCardPrompt(player);

        this.executeNextDraftStep();
    }

    confirmChosenCard(playerName) {
        const player = this.getPlayer(playerName);

        player.confirmChosenCard();
        this.setSelectCardPrompt(player);

        if(player.hasChosen) {
            this.gameLog.addMessage('{0} chooses a card', player);
        }

        this.executeNextDraftStep();
    }

    cancelChosenCard(playerName) {
        const player = this.getPlayer(playerName);
        if(player.hasChosen) {
            player.cancelChosenCard();
            this.gameLog.addMessage('{0} cancels their chosen card', player);
        }
        this.setSelectCardPrompt(player);

        this.executeNextDraftStep();
    }

    executeNextDraftStep() {
        if(!this.players.every(player => player.hasChosen)) {
            return;
        }

        for(const player of this.players) {
            player.addChosenCardToDeck();
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
            this.setSelectCardPrompt(this.players[i]);
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

    setSelectCardPrompt(player) {
        let menuTitle = 'Select a card to pick';
        let buttonText = 'Confirm selection';
        let buttonCommand = 'confirmChosenCard';
        if(player.hasChosen) {
            menuTitle = 'Waiting for opponents';
            buttonText = 'Cancel selection';
            buttonCommand = 'cancelChosenCard';
        }
        let draftPrompt = {
            menuTitle: menuTitle,
            promptTitle: 'Draft',
            buttons: [
                { text: buttonText, command: buttonCommand }
            ]
        };
        player.setPrompt(draftPrompt);
    }

    getState(playerName) {
        const activePlayer = this.getPlayer(playerName);
        return {
            activePlayer: activePlayer && activePlayer.getPlayerState(),
            currentRound: this.currentRound,
            draftFinished: this.draftFinished,
            rotateClockwise: this.rotateClockwise
        };
    }
}

module.exports = DraftingTable;
