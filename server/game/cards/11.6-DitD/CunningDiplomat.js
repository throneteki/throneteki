import DrawCard from '../../drawcard.js';

class CunningDiplomat extends DrawCard {
    // Shrewd Diplomat (11103)
    // Ambush (5). Shadow (3).
    // Reaction: After Shrewd Diplomat enters play during a challenge, choose a participating
    // character. Stand that character and remove it from the challenge.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && this.game.isDuringChallenge()
            },
            target: {
                cardCondition: (card) => card.getType() === 'character' && card.isParticipating()
            },
            handler: (context) => {
                context.target.controller.standCard(context.target);
                this.game.currentChallenge.removeFromChallenge(context.target);

                this.game.addMessage(
                    '{0} uses {1} to stand and remove {2} from the challenge',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

CunningDiplomat.code = '11103';

export default CunningDiplomat;
