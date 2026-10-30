import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Osha extends DrawCard {
    // Osha (03011)
    // Challenges Action: Remove Osha from the challenge. Then, stand her. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove Osha from the challenge and stand her',
            phase: 'challenge',
            limit: ability.limit.perPhase(1),
            condition: (context) => context.source.isParticipating(),
            message: '{player} removes {source} from the challenge and stands her',
            gameAction: GameActions.simultaneously([
                GameActions.removeFromChallenge((context) => ({ card: context.source })),
                GameActions.standCard((context) => ({ card: context.source }))
            ])
        });
    }
}

Osha.code = '03011';

export default Osha;
