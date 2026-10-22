import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerHyleHunt extends DrawCard {
    // Ser Hyle Hunt (08043)
    // Action: During a challenge in which Ser Hyle Hunt is participating, pay 1 gold to choose a
    // participating character with a lower STR than his. Stand that character and remove it from
    // the challenge. (Limit once per challenge.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove character from challenge',
            limit: ability.limit.perChallenge(1),
            condition: (context) => context.source.isParticipating(),
            cost: ability.costs.payGold(1),
            target: {
                cardCondition: (card, context) =>
                    card.isParticipating() && card.getStrength() < context.source.getStrength()
            },
            message:
                '{player} uses {source} and pays 1 gold to stand and remove {target} from the challenge',
            gameAction: GameActions.simultaneously([
                GameActions.standCard((context) => ({ card: context.target })),
                GameActions.removeFromChallenge((context) => ({ card: context.target }))
            ])
        });
    }
}

SerHyleHunt.code = '08043';

export default SerHyleHunt;
