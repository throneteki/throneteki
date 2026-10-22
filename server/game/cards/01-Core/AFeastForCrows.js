import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class AFeastForCrows extends PlotCard {
    // A Feast for Crows (01002)
    // Reaction: After you win dominance, gain 2 power for your faction.
    setupCardAbilities() {
        this.reaction({
            when: {
                onDominanceDetermined: (event, context) =>
                    event.winner === context.source.controller &&
                    context.source.controller.canGainFactionPower()
            },
            message: '{player} uses {source} to gain 2 power for their faction',
            gameAction: GameActions.gainPower((context) => ({
                card: context.player.faction,
                amount: 2
            }))
        });
    }
}

AFeastForCrows.code = '01002';

export default AFeastForCrows;
