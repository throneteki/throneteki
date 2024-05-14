import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ShadowOfTheRose extends DrawCard {
    setupCardAbilities() {
        this.action({
            message:
                '{player} plays {source} to search the top 10 cards of their deck for a card with shadow',
            gameAction: GameActions.search({
                title: 'Select a card',
                topCards: 10,
                match: { shadow: true },
                message: '{player} {gameAction}',
                gameAction: GameActions.simultaneously([
                    GameActions.putIntoShadows((context) => ({ card: context.searchTarget })),
                    GameActions.ifCondition({
                        condition: (context) => context.game.anyPlotHasTrait('Summer'),
                        thenAction: GameActions.returnCardToHand({ card: this })
                    })
                ])
            })
        });
    }
}

ShadowOfTheRose.code = '13084';

export default ShadowOfTheRose;
