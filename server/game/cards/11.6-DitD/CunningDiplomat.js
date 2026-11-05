import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CunningDiplomat extends DrawCard {
    // Shrewd Diplomat (11103)
    // Ambush (5). Shadow (3).
    // Reaction: After Shrewd Diplomat enters play during a challenge, choose a participating
    // character. Stand that character and remove it from the challenge.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card === context.source && context.game.isDuringChallenge()
            },
            target: {
                cardCondition: (card) => card.getType() === 'character' && card.isParticipating()
            },
            message: '{player} uses {source} to stand and remove {target} from the challenge',
            gameAction: GameActions.simultaneously([
                GameActions.standCard((context) => ({ card: context.target })),
                GameActions.removeFromChallenge((context) => ({ card: context.target }))
            ])
        });
    }
}

CunningDiplomat.code = '11103';

export default CunningDiplomat;
