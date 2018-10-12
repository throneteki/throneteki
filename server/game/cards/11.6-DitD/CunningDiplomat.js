const DrawCard = require('../../drawcard.js');

class CunningDiplomat extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => (
                    event.card === this &&
                    this.game.isDuringChallenge()
                )
            },
            target: {
                cardCondition: card => card.getType() === 'character' && card.isParticipating()
            },
            handler: context => {
                context.target.controller.standCard(context.target);
                this.game.currentChallenge.removeFromChallenge(context.target);

                this.game.addMessage('{0} uses {1} to remove {2} from the challenge', context.player, this, context.target);
            }
        });
    }
}

CunningDiplomat.code = '11103';

module.exports = CunningDiplomat;
