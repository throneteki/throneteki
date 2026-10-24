import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class StarrySepta extends DrawCard {
    // Starry Septa (27035)
    // Action: Kneel Starry Septa to choose a participating character with gold or power. Stand that
    // character and remove it from the challenge.
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand and remove participating character',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isParticipating() &&
                    (card.getPower() > 0 || card.hasToken(Tokens.gold))
            },
            message:
                '{player} kneels {costs.kneel} to stand {target} and remove it from the challenge',
            gameAction: GameActions.simultaneously([
                GameActions.standCard((context) => ({ card: context.target })),
                GameActions.removeFromChallenge((context) => ({ card: context.target }))
            ])
        });
    }
}

StarrySepta.code = '27035';

export default StarrySepta;
