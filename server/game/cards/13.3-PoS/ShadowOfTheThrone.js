import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ShadowOfTheThrone extends DrawCard {
    // Shadow of the Throne (13048)
    // Shadow (1).
    // Action: Choose and kneel any number of locations with total printed cost 3 or lower. If there
    // is a Kingdom plot card revealed, return Shadow of the Throne to your hand instead of placing
    // it in your discard pile.
    setupCardAbilities() {
        this.action({
            title: 'Kneel locations',
            target: {
                maxStat: () => 3,
                cardStat: (card) => card.getPrintedCost(),
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'location' && !card.kneeled,
                gameAction: 'kneel'
            },
            message: '{player} plays {source} to {gameAction}',
            gameAction: GameActions.simultaneously((context) => [
                ...context.target.map((card) => GameActions.kneelCard({ card })),
                GameActions.ifCondition({
                    condition: (context) => context.game.anyPlotHasTrait('Kingdom'),
                    thenAction: GameActions.returnCardToHand((context) => ({
                        card: context.source
                    }))
                })
            ])
        });
    }
}

ShadowOfTheThrone.code = '13048';

export default ShadowOfTheThrone;
