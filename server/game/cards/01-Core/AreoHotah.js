const DrawCard = require('../../drawcard.js');

class AreoHotah extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => (
                    event.card === this &&
                    this.game.currentChallenge &&
                    this.game.currentPhase === 'challenge'
                )
            },
            target: {
                cardCondition: card => card.getType() === 'character' && this.game.currentChallenge.isParticipating(card)
            },
            handler: context => {
                this.game.currentChallenge.removeFromChallenge(context.target);

                this.game.addMessage('{0} uses {1} to remove {2} from the challenge', context.player, this, context.target);
            }
        });
    }
}

AreoHotah.code = '01103';

module.exports = AreoHotah;
