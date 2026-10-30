import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DornishFiefdom extends DrawCard {
    // Dornish Fiefdom (06056)
    // Limited.
    // Marshaling Action: Kneel Dornish Fiefdom to gain 1 gold. (2 gold instead if you are not the
    // first player.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain gold',
            phase: 'marshal',
            condition: (context) => context.source.controller.canGainGold(),
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to gain {amount} gold',
                args: { amount: (context) => (!context.player.firstPlayer ? 2 : 1) }
            },
            gameAction: GameActions.gainGold((context) => ({
                player: context.player,
                amount: !context.player.firstPlayer ? 2 : 1
            }))
        });
    }
}

DornishFiefdom.code = '06056';

export default DornishFiefdom;
