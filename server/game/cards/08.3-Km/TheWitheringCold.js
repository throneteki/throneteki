import PlotCard from '../../plotcard.js';

class TheWitheringCold extends PlotCard {
    // The Withering Cold (08060)
    // Skip the standing phase this round.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.skipPhase('standing')
        });
    }
}

TheWitheringCold.code = '08060';

export default TheWitheringCold;
