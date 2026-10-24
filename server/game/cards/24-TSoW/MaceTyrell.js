import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MaceTyrell extends DrawCard {
    // Mace Tyrell (24022)
    // Renown.
    // Action: Stand a participating Army character and remove it from the challenge to choose
    // another participating character with equal or lower printed cost. Stand that character and
    // remove it from the challenge. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand and remove Army',
            condition: (context) => context.game.isDuringChallenge(),
            cost: [
                ability.costs.stand((card) => card.hasTrait('Army') && card.isParticipating()),
                ability.costs.removeFromChallenge(
                    (card) => card.hasTrait('Army') && card.isParticipating()
                )
            ],
            target: {
                cardCondition: (card, context) =>
                    card.isParticipating() &&
                    (!context.costs.stand ||
                        (card !== context.costs.stand &&
                            card.getPrintedCost() <= context.costs.stand.getPrintedCost()))
            },
            limit: ability.limit.perPhase(1),
            message:
                '{player} uses {source}, stands and removes {cost.stand} from the challenge to stand and remove {target} from the challenge',
            gameAction: GameActions.simultaneously((context) => [
                GameActions.standCard({ card: context.target }),
                GameActions.removeFromChallenge({ card: context.target })
            ])
        });
    }
}

MaceTyrell.code = '24022';

export default MaceTyrell;
