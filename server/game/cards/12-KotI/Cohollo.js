import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Cohollo extends DrawCard {
    // Cohollo (12035)
    // Intimidate.
    // Action: Kneel Cohollo and discard 1 card from your hand to have him participate in a
    // challenge on your side.
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard a card',
            cost: [ability.costs.kneelSelf(), ability.costs.discardFromHand()],
            condition: (context) => !!context.game.currentChallenge,
            message: {
                format: '{player} kneels {source} and discards {discardCost} to have {source} participate in the current challenge',
                args: {
                    discardCost: (context) => context.costs.discardFromHand
                }
            },
            gameAction: GameActions.addToChallenge((context) => ({
                card: context.source,
                player: context.player
            }))
        });
    }
}

Cohollo.code = '12035';

export default Cohollo;
