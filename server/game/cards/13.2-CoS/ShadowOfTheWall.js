import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ShadowOfTheWall extends DrawCard {
    // Shadow of the Wall (13026)
    // Shadow (0).
    // Action: Choose and stand a character with 1 or fewer challenge icons. If there is a Winter
    // plot card revealed, return Shadow of the Wall to your hand instead of placing it in your
    // discard pile.
    setupCardAbilities() {
        this.action({
            title: 'Stand a character with 1 or fewer challange icons',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getNumberOfIcons() <= 1
            },
            message: '{player} plays {source} to {gameAction}',
            gameAction: GameActions.simultaneously([
                GameActions.standCard((context) => ({ card: context.target })),
                GameActions.ifCondition({
                    condition: (context) => context.game.anyPlotHasTrait('Winter'),
                    thenAction: GameActions.returnCardToHand((context) => ({
                        card: context.source
                    }))
                })
            ])
        });
    }
}

ShadowOfTheWall.code = '13026';

export default ShadowOfTheWall;
