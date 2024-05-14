const DrawCard = require('../../drawcard.js');

class SerArchibaldYronwood extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onDominanceDetermined: (event) => event.winner && this.controller !== event.winner
            },
            handler: (context) => {
                this.game.promptForSelect(context.event.winner, {
                    source: this,
                    cardCondition: (card) =>
                        card.location === 'play area' &&
                        card.controller === context.event.winner &&
                        card.getType() === 'character',
                    gameAction: 'kill',
                    onSelect: (player, card) => this.onCardSelected(player, card),
                    onCancel: (player) => this.cancelSelection(player)
                });
            }
        });
    }
    onCardSelected(player, card) {
        this.game.killCharacter(card);
        this.game.addMessage(
            '{0} uses {1} to have {2} choose and kill {3}',
            this.controller,
            this,
            player,
            card
        );
        return true;
    }

    cancelSelection(player) {
        this.game.addAlert('danger', '{0} cancels the resolution of {1}', player, this);
        return true;
    }
}

SerArchibaldYronwood.code = '11055';

module.exports = SerArchibaldYronwood;
