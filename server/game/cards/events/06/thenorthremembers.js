const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class TheNorthRemembers extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Each player sacrifices a character or location',
            phase: 'challenge',
            handler: () => {
                this.game.addMessage('{0} plays {1} to have each player sacrifice a character or location', 
                                      this.controller, this);

                this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
                this.selections = [];
                this.proceedToNextStep();
            }
        });

        this.reaction({
            location: 'discard pile',
            when: {
                onCharacterKilled: event => event.card.controller === this.controller
            },
            ignoreEventCosts: true,
            cost: ability.costs.payGold(1),
            handler: () => {
                this.game.addMessage('{0} pays 1 gold to move {1} to their hand', this.controller, this);
                this.controller.moveCard(this, 'hand');
            }
        });
    }

    proceedToNextStep() {
        if(this.remainingPlayers.length > 0) {
            let currentPlayer = this.remainingPlayers.shift();
            this.game.promptForSelect(currentPlayer, {
                activePromptTitle: 'Select a character or location',
                source: this,
                cardCondition: card => (
                    card.controller === currentPlayer && 
                    (card.getType() === 'character' || card.getType() === 'location')),
                onSelect: (player, cards) => this.onCardSelected(player, cards),
                onCancel: (player) => this.cancelSelection(player)
            });
        } else {
            this.doDiscard();
        }
    }

    onCardSelected(player, card) {
        this.selections.push({ player: player, card: card });
        this.game.addMessage('{0} has selected {1} to sacrifice', player, card);
        this.proceedToNextStep();
        return true;
    }

    cancelSelection(player) {
        this.game.addMessage('{0} has cancelled the resolution of {1}', player, this);
        this.proceedToNextStep();
    }

    doDiscard() {
        _.each(this.selections, selection => {
            let player = selection.player;
            player.sacrificeCard(selection.card);
        });
    }
}

TheNorthRemembers.code = '06042';

module.exports = TheNorthRemembers;
