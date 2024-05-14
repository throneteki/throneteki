import PlotCard from '../../plotcard.js';

class EarlyFrost extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.modifyDrawPhaseCards(-1)
        });
    }
}

EarlyFrost.code = '05052';

export default EarlyFrost;
