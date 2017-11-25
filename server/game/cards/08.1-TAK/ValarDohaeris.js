const _ = require('underscore');

const PlotCard = require('../../plotcard.js');

class ValarDohaeris extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.selections = [];
                this.toMove = [];
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
            this.promptPlayersForOrder();
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

    promptPlayersForOrder() {
        _.each(this.selections, selection => {
            let player = selection.player;
            let playerSpecificToMove = _.difference(player.filterCardsInPlay(card => card.getType() === 'character' && card.allowGameAction('placeOnBottomOfDeck')), selection.cards);
            this.toMove = this.toMove.concat(playerSpecificToMove);
        });

        _.each(this.game.getPlayersInFirstPlayerOrder(), player => {
            let cardsOwnedByPlayer = _.filter(this.toMove, card => card.owner === player);

            if(_.size(cardsOwnedByPlayer) >= 2) {
                this.game.promptForSelect(player, {
                    ordered: true,
                    mode: 'exactly',
                    numCards: _.size(cardsOwnedByPlayer),
                    activePromptTitle: 'Select bottom deck order (last chosen ends up on bottom)',
                    cardCondition: card => cardsOwnedByPlayer.includes(card),
                    onSelect: (player, selectedCards) => {
                        this.toMove = _.reject(this.toMove, card => card.owner === player).concat(selectedCards);

                        return true;
                    }
                });
            }
        });

        this.game.queueSimpleStep(() => {
            this.moveCardsToBottom();
        });
    }

    moveCardsToBottom() {
        _.each(this.game.getPlayersInFirstPlayerOrder(), player => {
            let cardsOwnedByPlayer = _.filter(this.toMove, card => card.owner === player);

            if(!_.isEmpty(cardsOwnedByPlayer)) {
                _.each(cardsOwnedByPlayer, card => {
                    this.game.placeOnBottomOfDeck(card, { allowSave: false });
                });

                this.game.addMessage('{0} moves {1} to the bottom of their deck for {2}',
                    player, cardsOwnedByPlayer, this);
            } else {
                this.game.addMessage('{0} does not have any characters moved to the bottom of their deck for {1}',
                    player, this);
            }
        });

        this.selections = [];
        this.toMove = [];
    }
}

ValarDohaeris.code = '08020';

module.exports = ValarDohaeris;
