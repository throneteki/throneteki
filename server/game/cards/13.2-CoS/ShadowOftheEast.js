import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ShadowOfTheEast extends DrawCard {
    // Shadow of the East (13034)
    // Shadow (0).
    // Action: Choose an attachment and discard it from play. If there is a Summer plot card
    // revealed, return Shadow of the East to your hand instead of placing it in your discard pile.
    setupCardAbilities() {
        this.action({
            title: 'Select an attachment',
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'attachment'
            },
            message: '{player} plays {source} and {gameAction}',
            gameAction: GameActions.simultaneously([
                GameActions.discardCard((context) => ({ card: context.target })),
                GameActions.ifCondition({
                    condition: (context) => context.game.anyPlotHasTrait('Summer'),
                    thenAction: GameActions.returnCardToHand((context) => ({
                        card: context.source
                    }))
                })
            ])
        });
    }
}

ShadowOfTheEast.code = '13034';

export default ShadowOfTheEast;
