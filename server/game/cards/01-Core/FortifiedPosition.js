import PlotCard from '../../plotcard.js';

class FortifiedPosition extends PlotCard {
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
