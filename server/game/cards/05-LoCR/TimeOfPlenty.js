import PlotCard from '../../plotcard.js';

class TimeOfPlenty extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.modifyDrawPhaseCards(1)
        });
    }
}

TimeOfPlenty.code = '05051';

export default TimeOfPlenty;
