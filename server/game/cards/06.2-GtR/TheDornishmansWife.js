import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TheDornishmansWife extends DrawCard {
    // "The Dornishman's Wife" (06039)
    // Action: Choose an opponent. If that player has a higher power total than you, gain 2 gold. If
    // that player has more cards in his or her hand than you, gain 1 power for your faction. If
    // that player controls more characters than you, draw 1 card.
    setupCardAbilities() {
        this.action({
            title: 'Gain gold/power/card',
            chooseOpponent: (opponent, context) => bonuses(context.player, opponent).length > 0,
            message: '{player} plays {source} and {gameAction}',
            gameAction: GameActions.simultaneously((context) =>
                bonuses(context.player, context.opponent)
            )
        });
    }
}

function bonuses(player, opponent) {
    const characterCount = (controller) =>
        controller.getNumberOfCardsInPlay((card) => card.getType() === 'character');
    return [
        ...(opponent.getTotalPower() > player.getTotalPower()
            ? [GameActions.gainGold({ player, amount: 2 })]
            : []),
        ...(opponent.getHandCount() > player.getHandCount()
            ? [GameActions.gainPower({ card: player.faction, amount: 1 })]
            : []),
        ...(characterCount(opponent) > characterCount(player)
            ? [GameActions.drawCards({ player, amount: 1 })]
            : [])
    ];
}

TheDornishmansWife.code = '06039';

export default TheDornishmansWife;
