const DrawCard = require('../../drawcard.js');

class GennaFrey extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.number === 3 &&
                    this.isAttacking()
            },
            handler: (context) => {
                let numCards = this.hasOtherAttackingFrey() ? 2 : 1;
                context.event.challenge.loser.discardAtRandom(numCards, (cards) => {
                    this.game.addMessage(
                        "{0} uses {1} to discard {2} from {3}'s hand",
                        this.controller,
                        this,
                        cards,
                        context.event.challenge.loser
                    );
                });
            }
        });
    }

    hasOtherAttackingFrey() {
        return this.controller.anyCardsInPlay(
            (card) =>
                card.isAttacking() &&
                card.hasTrait('House Frey') &&
                card.getType() === 'character' &&
                card !== this
        );
    }
}

GennaFrey.code = '06109';

module.exports = GennaFrey;
