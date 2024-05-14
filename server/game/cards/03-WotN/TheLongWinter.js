const PlotCard = require('../../plotcard.js');

class TheLongWinter extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.selections = [];
                this.remainingPlayers = this.game
                    .getPlayersInFirstPlayerOrder()
                    .filter((player) => !player.activePlot.hasTrait('Summer'));
                this.proceedToNextStep();
            }
        });
    }

    cancelSelection(player) {
        this.game.addAlert('danger', '{0} cancels the resolution of {1}', player, this);
        this.proceedToNextStep();

        return true;
    }

    onCardSelected(player, card) {
        let cardFragment = card.getType() === 'faction' ? 'their faction' : card;
        this.selections.push({ player: player, card: card, cardFragment: cardFragment });
        this.game.addMessage('{0} selects {1} to lose power from {2}', player, cardFragment, this);
        this.proceedToNextStep();

        return true;
    }

    doPower() {
        for (let selection of this.selections) {
            this.game.addMessage(
                '{0} discards 1 power from {1}',
                selection.player,
                selection.cardFragment
            );
            selection.card.modifyPower(-1);
        }

        this.selections = [];
    }

    proceedToNextStep() {
        if (this.remainingPlayers.length > 0) {
            let currentPlayer = this.remainingPlayers.shift();
            if (currentPlayer.getTotalPower() >= 1) {
                this.game.promptForSelect(currentPlayer, {
                    activePromptTitle: 'Select a card',
                    source: this,
                    cardCondition: (card) =>
                        card.controller === currentPlayer && card.getPower() > 0,
                    cardType: ['attachment', 'character', 'faction', 'location'],
                    onSelect: (player, card) => this.onCardSelected(player, card),
                    onCancel: (player) => this.cancelSelection(player)
                });
            } else {
                this.game.addMessage(
                    '{0} does not have any power to discard for {1}',
                    currentPlayer,
                    this
                );
                this.proceedToNextStep();
            }
        } else {
            this.doPower();
        }
    }
}

TheLongWinter.code = '03049';

module.exports = TheLongWinter;
