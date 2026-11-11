import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class IronIslandsMarket extends DrawCard {
    // Iron Islands Market (06032)
    // Limited.
    // Marshaling Action: Kneel Iron Islands Market to gain 1 gold. (2 gold instead if an opponent
    // has 8 or more cards in his or her discard pile.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain gold',
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to gain {amount} gold',
                args: { amount: (context) => marketGold(context) }
            },
            gameAction: GameActions.gainGold((context) => ({
                player: context.player,
                amount: marketGold(context)
            }))
        });
    }
}

function marketGold(context) {
    return context.game
        .getOpponents(context.player)
        .some((opponent) => opponent.discardPile.length >= 8)
        ? 2
        : 1;
}

IronIslandsMarket.code = '06032';

export default IronIslandsMarket;
