import PlotCard from '../../plotcard.js';

class BarringTheGates extends PlotCard {
    // Barring the Gates (06019)
    // Card abilities cannot cause characters to enter play.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.cannotPutIntoPlay(
                (card, playingType) => card.getType() === 'character' && playingType !== 'marshal'
            )
        });
    }
}

BarringTheGates.code = '06019';

export default BarringTheGates;
