const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class WildfireAssault extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.selections = [];
                this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
                this.proceedToNextStep();
            }
        });
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
        this.selections.push({ player: player, cards: [] });
        this.proceedToNextStep();
    }

    doKill() {
        let characters = [];

        _.each(this.selections, selection => {
            let player = selection.player;
            let toKill = _.difference(player.filterCardsInPlay(card => card.getType() === 'character'), selection.cards);

            characters = characters.concat(toKill);

            if(_.isEmpty(toKill)) {
                this.game.addMessage('{0} does not have any characters killed for {1}', player, this);
            } else {
                this.game.addMessage('{0} has {1} killed because of {2}', player, toKill, this);
            }
        });

        this.game.killCharacters(characters, false);

        this.selections = [];
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
                numCards: 3,
                activePromptTitle: 'Select up to 3 characters',
                source: this,
                cardCondition: card => card.location === 'play area' && card.controller === currentPlayer && card.getType() === 'character',
                onSelect: (player, cards) => this.onSelect(player, cards),
                onCancel: (player) => this.cancelSelection(player)
            });
        } else {
            this.doKill();
        }
    }
}

WildfireAssault.code = '01026';

module.exports = WildfireAssault;
