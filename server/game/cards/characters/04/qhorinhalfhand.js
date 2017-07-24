const DrawCard = require('../../../drawcard.js');

class QhorinHalfhand extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.challengeType === 'military' &&
                    challenge.winner === this.controller &&
                    challenge.isParticipating(this)
                )
            },
            target: {
                activePromptTitle: 'Select a character to kill',
                cardCondition: card => card.location === 'play area' && card.controller !== this.controller && card.getType() === 'character' &&
                                       !card.isUnique() && card.getStrength() < this.getStrength(),
                gameAction: 'kill'
            },
            handler: context => {
                context.target.controller.killCharacter(context.target);
                this.game.addMessage('{0} uses {1} to kill {2}', this.controller, this, context.target);
            }
        });
    }
}

QhorinHalfhand.code = '04105';

module.exports = QhorinHalfhand;
