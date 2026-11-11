import PlotCard from '../../plotcard.js';

class EarlyFrost extends PlotCard {
    // Early Frost (05052)
    // Reduce the number of cards each player draws in the draw phase by 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.modifyDrawPhaseCards(-1)
        });
    }
}

EarlyFrost.code = '05052';

export default EarlyFrost;
