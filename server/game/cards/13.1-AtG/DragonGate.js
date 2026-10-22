import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DragonGate extends DrawCard {
    // Dragon Gate (13014)
    // Limited.
    // Challenges Action: If you control 2 or more attachments, sacrifice Dragon Gate to draw 2
    // cards.
    // +1 Income.
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });
        this.action({
            title: 'Sacrifice to draw 2 cards',
            condition: (context) => context.source.getCardCount(context.player) >= 2,
            phase: 'challenge',
            cost: ability.costs.sacrificeSelf(),
            message: '{player} sacrifices {source} to draw 2 cards',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 2 }))
        });
    }

    getCardCount(player) {
        return player.getNumberOfCardsInPlay((card) => ['attachment'].includes(card.getType()));
    }
}

DragonGate.code = '13014';

export default DragonGate;
