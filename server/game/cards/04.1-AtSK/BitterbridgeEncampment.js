const DrawCard = require('../../drawcard.js');

class BitterbridgeEncampment extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onPlotsRevealed: (event) =>
                    event.plots.some((plot) => plot.hasTrait('Summer')) && !this.kneeled
            },
            handler: () => {
                this.controller.kneelCard(this);

                this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
                this.selections = [];
                this.proceedToNextStep();
            }
        });
    }

    cancelSelection(player) {
        this.game.addMessage('{0} does not select a character for {1}', player, this);
        this.proceedToNextStep();
    }

    onCardSelected(player, card) {
        this.selections.push({ player: player, card: card });
        this.game.addMessage('{0} selects {1} to put into play with {2}', player, card, this);
        this.proceedToNextStep();

        return true;
    }

    doPutIntoPlay() {
        for (let selection of this.selections) {
            let player = selection.player;
            player.putIntoPlay(selection.card);
        }
    }

    proceedToNextStep() {
        if (this.remainingPlayers.length > 0) {
            let currentPlayer = this.remainingPlayers.shift();
            this.game.promptForSelect(currentPlayer, {
                source: this,
                cardCondition: (card) =>
                    card.controller === currentPlayer &&
                    card.getType() === 'character' &&
                    card.location === 'hand' &&
                    currentPlayer.canPutIntoPlay(card),
                onSelect: (player, card) => this.onCardSelected(player, card),
                onCancel: (player) => this.cancelSelection(player)
            });
        } else {
            this.doPutIntoPlay();
        }
    }
}

BitterbridgeEncampment.code = '04005';

module.exports = BitterbridgeEncampment;
