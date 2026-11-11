import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BronzeYohnRoyce extends DrawCard {
    // Bronze Yohn Royce (12039)
    // Renown.
    // Reaction: After you win a challenge in which Bronze Yohn Royce is defending, kneel a neutral
    // location with printed cost 1 or higher to stand him. (Limit twice per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.isDefending() &&
                    context.source.kneeled
            },
            cost: ability.costs.kneel(
                (card) =>
                    card.getType() === 'location' &&
                    card.isFaction('neutral') &&
                    card.getPrintedCost() >= 1
            ),
            message: '{player} uses {source} and kneels {costs.kneel} to stand {source}',
            gameAction: GameActions.standCard((context) => ({ card: context.source }))
        });
    }
}

BronzeYohnRoyce.code = '12039';

export default BronzeYohnRoyce;
