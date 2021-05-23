const DrawCard = require('../../drawcard.js');

class ThisMustBeAnsweredFiercely extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onChallengeInitiated: event =>
                    event.challenge.initiatedAgainstPlayer === this.controller && event.challenge.attackers.length >= 3
            },
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.getType() === 'character' && card.isFaction('tyrell')
                        && this.controller.canPutIntoPlay(card),
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        player.putIntoPlay(card);
        this.game.addMessage('{0} uses {1} to search their deck and put {2} into play',
            player, this, card);
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not put any card into play',
            player, this);
    }
}

ThisMustBeAnsweredFiercely.code = '08104';

module.exports = ThisMustBeAnsweredFiercely;
