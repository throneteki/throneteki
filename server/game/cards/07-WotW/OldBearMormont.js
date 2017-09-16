const DrawCard = require('../../drawcard.js');

class OldBearMormont extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: ({challenge}) => challenge.winner === this.controller && challenge.isParticipating(this)
            },
            target: {
                cardCondition: card => (
                    !card.isUnique() &&
                    card.getType() === 'character' &&
                    card.controller !== this.controller &&
                    card.location === 'discard pile')
            },
            handler: context => {
                let originalPlayer = context.target.controller;
                this.controller.putIntoPlay(context.target);

                this.game.addMessage('{0} uses {1} to put {2} into play under their control from {3}\'s discard pile',
                    this.controller, this, context.target, originalPlayer);
            }
        });
    }
}

OldBearMormont.code = '07003';

module.exports = OldBearMormont;
