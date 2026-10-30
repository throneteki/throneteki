import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AcolyteOfTheWaves extends DrawCard {
    // Acolyte of the Waves (08012)
    // Interrupt: When Acolyte of the Waves is killed, gain 1 power for your faction.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event, context) =>
                    event.card === context.source && context.source.controller.canGainFactionPower()
            },
            message: '{player} uses {source} to gain 1 power for their faction',
            gameAction: GameActions.gainPower((context) => ({
                card: context.player.faction,
                amount: 1
            }))
        });
    }
}

AcolyteOfTheWaves.code = '08012';

export default AcolyteOfTheWaves;
