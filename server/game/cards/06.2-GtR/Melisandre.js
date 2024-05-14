const DrawCard = require('../../drawcard.js');

class Melisandre extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onDominanceDetermined: (event) => this.controller === event.winner
            },
            chooseOpponent: (opponent) => opponent.hand.length !== 0,
            handler: (context) => {
                this.game.addMessage(
                    "{0} uses {1} to look at {2}'s hand",
                    context.player,
                    this,
                    context.opponent
                );
                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Select a card',
                    source: this,
                    revealTargets: true,
                    cardCondition: (card) =>
                        card.location === 'hand' && card.controller === context.opponent,
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        let otherPlayer = card.controller;

        otherPlayer.discardCards([card], true, () => {
            let charMessage = '';

            if (card.getType() === 'character') {
                charMessage = ' and place it in the dead pile';
                otherPlayer.moveCard(card, 'dead pile');
            }

            this.game.addMessage(
                "{0} then uses {1} to discard {2} from {3}'s hand{4}",
                player,
                this,
                card,
                otherPlayer,
                charMessage
            );
        });

        return true;
    }
}

Melisandre.code = '06027';

module.exports = Melisandre;
