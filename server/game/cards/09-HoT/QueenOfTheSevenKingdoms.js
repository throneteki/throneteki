import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

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
            message: {
                format: '{player} uses {source} and stands and removes {parent} from the challenge to stand and remove {target} from the challenge',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.simultaneously([
                GameActions.standCard((context) => ({ card: context.target })),
                GameActions.removeFromChallenge((context) => ({ card: context.target }))
            ])
        });
    }
}

QueenOfTheSevenKingdoms.code = '09020';

export default QueenOfTheSevenKingdoms;
