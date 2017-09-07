const DrawCard = require('../../../drawcard.js');

class RattleshirtsRaiders extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: ({challenge}) => (
                    challenge.attackingPlayer === this.controller &&
                    challenge.winner === this.controller &&
                    challenge.isAttacking(this)
                )
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select an attachment',
                    source: this,
                    cardCondition: card => card.location === 'play area' && card.controller === this.game.currentChallenge.loser && card.getType() === 'attachment',
                    onSelect: (p, card) => this.onCardSelected(p, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        card.owner.discardCard(card);

        this.game.addMessage('{0} uses {1} to discard {2}', player, this, card);

        return true;
    }
}

RattleshirtsRaiders.code = '01030';

module.exports = RattleshirtsRaiders;
