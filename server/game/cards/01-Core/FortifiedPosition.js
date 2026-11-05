import PlotCard from '../../plotcard.js';

class FortifiedPosition extends PlotCard {
    // Fortified Position (01012)
    // Treat each character as if its printed text box were blank (except for Traits).
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.getType() === 'character',
            targetController: 'any',
            effect: ability.effects.blankExcludingTraits
        });
    }
}

FortifiedPosition.code = '01012';

export default FortifiedPosition;
