import PlotCard from '../../plotcard.js';

class TimeOfPlenty extends PlotCard {
    // Time of Plenty (05051)
    // Increase the number of cards each player draws in the draw phase by 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.modifyDrawPhaseCards(1)
        });
    }
}

TimeOfPlenty.code = '05051';

export default TimeOfPlenty;
