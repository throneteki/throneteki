import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class RiseOfTheKraken extends PlotCard {
    // Rise of the Kraken (02012)
    // Interrupt: When you gain power for winning an unopposed challenge, gain 2 power instead.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onUnopposedGain: (event, context) => event.challenge.winner === context.player
            },
            message:
                '{player} uses {source} to gain 2 power for winning an unopposed challenge instead of 1',
            gameAction: GameActions.replaceEvent((context) => ({
                event: context.event,
                replacement: GameActions.gainPower({ card: context.player.faction, amount: 2 })
            }))
        });
    }
}

RiseOfTheKraken.code = '02012';

export default RiseOfTheKraken;
