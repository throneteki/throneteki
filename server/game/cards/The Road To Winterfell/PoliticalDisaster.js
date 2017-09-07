const _ = require('underscore');

const PlotCard = require('../../plotcard.js');

class PoliticalDisaster extends PlotCard {
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
            this.game.addMessage('{0} does not choose any locations for {1}', player, this);
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

    doDiscard() {
        _.each(this.selections, selection => {
            let player = selection.player;
            let toDiscard = _.difference(player.filterCardsInPlay(card => card.getType() === 'location'), selection.cards);

            _.each(toDiscard, card => {
                player.discardCard(card);
            });

            if(!_.isEmpty(toDiscard)) {
                this.game.addMessage('{0} discards {1} for {2}', player, toDiscard, this);
            }
        });

        this.selections = [];
    }

    proceedToNextStep() {
        if(this.remainingPlayers.length > 0) {
            let currentPlayer = this.remainingPlayers.shift();

            if(!currentPlayer.anyCardsInPlay(card => card.getType() === 'location')) {
                this.selections.push({ player: currentPlayer, cards: [] });
                this.proceedToNextStep();
                return true;
            }

            this.game.promptForSelect(currentPlayer, {
                numCards: 2,
                activePromptTitle: 'Select up to 2 locations',
                source: this,
                cardCondition: card =>
                    card.controller === currentPlayer
                    && card.getType() === 'location'
                    && card.location === 'play area',
                onSelect: (player, cards) => this.onSelect(player, cards),
                onCancel: (player) => this.cancelSelection(player)
            });
        } else {
            this.doDiscard();
        }
    }
}

PoliticalDisaster.code = '02040';

module.exports = PoliticalDisaster;
