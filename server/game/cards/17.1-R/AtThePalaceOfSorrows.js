import PlotCard from '../../plotcard.js';

class AtThePalaceOfSorrows extends PlotCard {
    // At the Palace of Sorrows (17156)
    // Set each character's STR to 3.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.getType() === 'character',
            targetController: 'any',
            effect: ability.effects.setStrength(3)
        });
    }
}

AtThePalaceOfSorrows.code = '17156';

export default AtThePalaceOfSorrows;
