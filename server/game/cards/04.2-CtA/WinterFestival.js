import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class WinterFestival extends PlotCard {
    // Winter Festival (04040)
    // Interrupt: When the challenges phase ends, if there are no Summer plot cards revealed, gain 2
    // power for your faction.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onPhaseEnded: (event, context) =>
                    event.phase === 'challenge' &&
                    !context.game.anyPlotHasTrait('Summer') &&
                    context.source.controller.canGainFactionPower()
            },
            message: '{player} gains 2 power from {source}',
            gameAction: GameActions.gainPower((context) => ({
                card: context.player.faction,
                amount: 2
            }))
        });
    }
}

WinterFestival.code = '04040';

export default WinterFestival;
