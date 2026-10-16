import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class StarrySepta extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand and remove participating character',
            phase: 'challenge',
            condition: () =>
                this.game.filterCardsInPlay(
                    (card) =>
                        card.getType() === 'character' &&
                        card.isParticipating() &&
                        (card.getPower() > 0 || card.hasToken(Tokens.gold))
                ).length > 0,
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
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.simultaneously([
                        GameActions.standCard((context) => ({ card: context.target })),
                        GameActions.removeFromChallenge((context) => ({
                            card: context.target,
                            reason: 'effect'
                        }))
                    ]),
                    context
                );
            }
        });
    }
}

StarrySepta.code = '27035';

export default StarrySepta;
