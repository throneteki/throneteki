const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class RamsaySnow extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardEntersPlay: event => event.card === this
            },
            handler: () => {
                this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
                this.selections = [];
                this.proceedToNextStep();
            }
        });
    }

    cancelSelection(player) {
        this.game.addAlert('danger', '{0} cancels the resolution of {1}', player, this);
        this.proceedToNextStep();
    }

    onCardSelected(player, card) {
        this.selections.push({ player: player, card: card });
        this.game.addMessage('{0} selects {1} to sacrifice for {2}', player, card, this);
        this.proceedToNextStep();
        return true;
    }

    doSacrifice() {
        _.each(this.selections, selection => {
            let player = selection.player;
            player.sacrificeCard(selection.card);
        });
    }

    proceedToNextStep() {
        if(this.remainingPlayers.length > 0) {
            let currentPlayer = this.remainingPlayers.shift();

            if(!currentPlayer.anyCardsInPlay(card => card.getType() === 'character')) {
                this.game.addMessage('{0} has no characters in play to sacrifice for {1}', currentPlayer, this);
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
            this.doSacrifice();
        }
    }
}

RamsaySnow.code = '08041';

module.exports = RamsaySnow;
