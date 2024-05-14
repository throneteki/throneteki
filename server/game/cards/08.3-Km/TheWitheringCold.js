import PlotCard from '../../plotcard.js';

class TheWitheringCold extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.skipPhase('standing')
        });
    }
}

TheWitheringCold.code = '08060';

export default TheWitheringCold;
