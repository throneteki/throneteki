import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Arry extends DrawCard {
    // Arry (04006)
    // Ambush (4).
    // If you control Arya Stark, sacrifice Arry.
    // Action: Return Arry to your hand to draw 1 card.
    setupCardAbilities(ability) {
        this.stateCheck({
            condition: (context) =>
                context.player.anyCardsInPlay({ type: 'character', name: 'Arya Stark' }),
            message: '{player} sacrifices {source} as they control Arya Stark',
            gameAction: GameActions.sacrificeCard((context) => ({ card: context.source }))
        });

        this.action({
            title: 'Draw 1 card',
            cost: ability.costs.returnSelfToHand(),
            message: '{player} returns {source} to their hand to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

Arry.code = '04006';

export default Arry;
