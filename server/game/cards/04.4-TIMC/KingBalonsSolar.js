import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class KingBalonsSolar extends DrawCard {
    // King Balon's Solar (04072)
    // Reaction: After you win initiative, gain 1 gold.
    setupCardAbilities() {
        this.reaction({
            when: {
                onInitiativeDetermined: (event, context) =>
                    event.winner === context.source.controller &&
                    context.source.controller.canGainGold()
            },
            message: '{player} uses {source} to gain 1 gold',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

KingBalonsSolar.code = '04072';

export default KingBalonsSolar;
