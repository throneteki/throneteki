const _ = require('underscore');

const PlotCard = require('../../plotcard.js');

class ThePaleMare extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.selections = [];
                this.toKill = [];
                this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
                this.proceedToNextStep();
            }
        });
    }

    proceedToNextStep() {
        if(this.remainingPlayers.length > 0) {
            let currentPlayer = this.remainingPlayers.shift();

            if(!currentPlayer.anyCardsInPlay(card => card.getType() === 'character')) {
                this.game.addMessage('{0} has no characters in play to choose for {1}', currentPlayer, this);
                this.selections.push({ player: currentPlayer, cards: [] });
                this.proceedToNextStep();
                return true;
            }

            this.game.promptForSelect(currentPlayer, {
                activePromptTitle: 'Select character(s)',
                maxStat: () => 10,
                cardStat: card => card.getPrintedCost(),
                source: this,
                cardCondition: card => card.location === 'play area' && card.controller === currentPlayer && card.getType() === 'character',
                onSelect: (player, cards) => this.onSelect(player, cards),
                onCancel: (player) => this.cancelSelection(player)
            });
        } else {
            this.doKill();
        }
    }

    onSelect(player, cards) {
        if(_.isEmpty(cards)) {
            this.game.addMessage('{0} does not choose any characters for {1}', player, this);
        } else {
            this.game.addMessage('{0} chooses {1} for {2}', player, cards, this);
        }
        this.selections.push({ player: player, cards: cards });
        this.proceedToNextStep();
        return true;
    }

    cancelSelection(player) {
        this.game.addMessage('{0} does not choose any characters for {1}', player, this);
        this.selections.push({ player: player, cards: [] });
        this.proceedToNextStep();
    }

    doKill() {
        _.each(this.selections, selection => {
            let player = selection.player;
            let playerSpecificToKill = _.difference(player.filterCardsInPlay(card => card.getType() === 'character'), selection.cards);
            this.toKill = this.toKill.concat(playerSpecificToKill);

            if(_.isEmpty(playerSpecificToKill)) {
                this.game.addMessage('{0} does not kill any characters for {1}', player, this);
            } else {
                this.game.addMessage('{0} kills {1} for {2}', player, playerSpecificToKill, this);
            }
        });

        this.game.killCharacters(this.toKill, { allowSave: false });

        this.selections = [];
        this.toKill = [];
    }
}

ThePaleMare.code = '00008';

module.exports = ThePaleMare;
