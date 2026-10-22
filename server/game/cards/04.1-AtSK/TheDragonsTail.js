import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheDragonsTail extends DrawCard {
    // The Dragon's Tail (04001)
    // Action: Choose an opponent. You and that player each draw 2 cards.
    setupCardAbilities() {
        this.action({
            title: 'Both you and opponent draw 2 cards',
            chooseOpponent: true,
            message: '{player} uses {source} to make both themself and {opponent} draw 2 cards',
            gameAction: GameActions.simultaneously([
                GameActions.drawCards((context) => ({ player: context.player, amount: 2 })),
                GameActions.drawCards((context) => ({ player: context.opponent, amount: 2 }))
            ])
        });
    }
}

TheDragonsTail.code = '04001';

export default TheDragonsTail;
