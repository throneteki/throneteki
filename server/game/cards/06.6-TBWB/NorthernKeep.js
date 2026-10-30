import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NorthernKeep extends DrawCard {
    // Northern Keep (06102)
    // Limited.
    // Marshaling Action: Kneel Northern Keep to gain 1 gold. (2 gold instead if there are more
    // Winter plot cards than Summer plot cards revealed.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain gold',
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to gain {amount} gold',
                args: { amount: (context) => keepGold(context.game) }
            },
            gameAction: GameActions.gainGold((context) => ({
                player: context.player,
                amount: keepGold(context.game)
            }))
        });
    }
}

function keepGold(game) {
    return game.getNumberOfPlotsWithTrait('Winter') > game.getNumberOfPlotsWithTrait('Summer')
        ? 2
        : 1;
}

NorthernKeep.code = '06102';

export default NorthernKeep;
