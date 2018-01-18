const _ = require('underscore');

const PlotCard = require('../../plotcard.js');

class MarchedToTheWall extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
                this.selections = [];
                this.proceedToNextStep();
            }
        });
    }

    cancelSelection(player) {
        this.game.addMessage('{0} cancels the resolution of {1}', player, this);
        this.proceedToNextStep();
    }

    onCardSelected(player, card) {
        this.selections.push({ player: player, card: card });
        this.game.addMessage('{0} selects {1} to discard for {2}', player, card, this);
        this.proceedToNextStep();
        return true;
    }

    doDiscard() {
        _.each(this.selections, selection => {
            let player = selection.player;
            player.discardCard(selection.card, false);
        });
    }

    proceedToNextStep() {
        if(this.remainingPlayers.length > 0) {
            let currentPlayer = this.remainingPlayers.shift();

            if(!currentPlayer.anyCardsInPlay(card => card.getType() === 'character')) {
                this.proceedToNextStep();
                return true;
            }

            this.game.promptForSelect(currentPlayer, {
                source: this,
                cardCondition: card => card.location === 'play area' && card.controller === currentPlayer && card.getType() === 'character',
                onSelect: (player, cards) => this.onCardSelected(player, cards),
                onCancel: (player) => this.cancelSelection(player)
            });
        } else {
            this.doDiscard();
        }
    }
}

MarchedToTheWall.code = '01015';

module.exports = MarchedToTheWall;
