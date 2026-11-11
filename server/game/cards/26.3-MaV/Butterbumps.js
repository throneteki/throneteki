import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Butterbumps extends DrawCard {
    // Butterbumps (26055)
    // Shadow (2).
    // Challenges Action: During a challenge in which Butterbumps is participating, return him to
    // shadows to choose a participating character with a higher STR than his. Stand that character
    // and remove it from the challenge.
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand and remove from challenge',
            condition: (context) => context.source.isParticipating(),
            target: {
                cardCondition: {
                    location: 'play area',
                    type: 'character',
                    participating: true,
                    condition: (card, context) => card.getStrength() > context.source.getStrength()
                }
            },
            cost: ability.costs.putSelfIntoShadows(),
            phase: 'challenge',
            message:
                '{player} returns {source} to shadows to stand and remove {target} from challenge',
            gameAction: GameActions.simultaneously((context) => [
                GameActions.standCard({ card: context.target }),
                GameActions.removeFromChallenge({ card: context.target })
            ])
        });
    }
}

Butterbumps.code = '26055';

export default Butterbumps;
