const DrawCard = require('../../drawcard.js');

class RattleshirtsRaiders extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.attackingPlayer === this.controller &&
                    event.challenge.winner === this.controller &&
                    this.isAttacking()
            },
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.game.currentChallenge.loser &&
                    card.getType() === 'attachment'
            },
            handler: (context) => {
                context.target.owner.discardCard(context.target);

                this.game.addMessage(
                    '{0} uses {1} to discard {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

RattleshirtsRaiders.code = '01030';

module.exports = RattleshirtsRaiders;
