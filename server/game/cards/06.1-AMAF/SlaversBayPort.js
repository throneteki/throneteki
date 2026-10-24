import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SlaversBayPort extends DrawCard {
    // Slaver's Bay Port (06014)
    // Limited.
    // Marshaling Action: Kneel Slaver's Bay Port to gain 1 gold. (2 gold instead if an opponent has
    // 4 or more characters in his or her dead pile.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain gold',
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to gain {amount} gold',
                args: { amount: (context) => goldAmount(context) }
            },
            gameAction: GameActions.gainGold((context) => ({
                player: context.player,
                amount: goldAmount(context)
            }))
        });
    }
}

function goldAmount(context) {
    return context.game
        .getOpponents(context.player)
        .some((opponent) => opponent.deadPile.length >= 4)
        ? 2
        : 1;
}

SlaversBayPort.code = '06014';

export default SlaversBayPort;
