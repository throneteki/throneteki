import DrawCard from '../../drawcard.js';

class QueenOfTheSevenKingdoms extends DrawCard {
    // Queen of the Seven Kingdoms (09020)
    // Lady character only.
    // Attached character gains the Queen trait.
    // Action Stand attached character and remove it from the challenge to choose a participating
    // character. Stand that character and remove it from the challenge. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Lady' });

        this.whileAttached({
            effect: ability.effects.addTrait('Queen')
        });

        this.action({
            title: 'Stand and remove character from challenge',
            cost: [ability.costs.standParent(), ability.costs.removeParentFromChallenge()],
            target: {
                cardCondition: (card) => card.isParticipating()
            },
            limit: ability.limit.perPhase(1),
            handler: (context) => {
                context.target.controller.standCard(context.target);
                this.game.currentChallenge.removeFromChallenge(context.target);
                this.game.addMessage(
                    '{0} uses {1} and stands and removes {2} from the challenge to stand and remove {3} from the challenge',
                    context.player,
                    this,
                    this.parent,
                    context.target
                );
            }
        });
    }
}

QueenOfTheSevenKingdoms.code = '09020';

export default QueenOfTheSevenKingdoms;
