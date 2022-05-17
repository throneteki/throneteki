const DrawCard = require('../../drawcard.js');

class PyatPree extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.isParticipating()
            },
            message: {
                format: '{player} uses {source} to search the top {numCards} cards of their deck for a Targaryen attachment',
                args: { numCards: context => context.game.currentChallenge.strengthDifference }
            },
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    numCards: this.game.currentChallenge.strengthDifference,
                    activePromptTitle: 'Select a card',
                    cardCondition: card => (card.getType() === 'attachment' || card.getType() === 'event') && card.isFaction('targaryen'),
                    onSelect: (player, card, valid) => this.cardSelected(player, card, valid),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card, valid) {
        if(valid) {
            player.moveCard(card, 'hand');
            this.game.addMessage('{0} adds {1} to their hand',
                player, card);
        }
    }

    doneSelecting(player) {
        this.game.addMessage('{0} does not add any card to their hand',
            player);
    }
}

PyatPree.code = '04073';

module.exports = PyatPree;
