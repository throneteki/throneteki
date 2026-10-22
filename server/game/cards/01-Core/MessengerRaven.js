import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MessengerRaven extends DrawCard {
    // Messenger Raven (01130)
    // No attachments.
    // Dominance Action: Return Messenger Raven to your hand to draw 1 card.
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw 1 card',
            phase: 'dominance',
            condition: (context) => context.source.controller.canDraw(),
            cost: ability.costs.returnSelfToHand(),
            message: '{player} returns {source} to their hand to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

MessengerRaven.code = '01130';

export default MessengerRaven;
