import DrawCard from '../../drawcard.js';

class Helya extends DrawCard {
    // Helya (04091)
    // Each attachment gains terminal.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card) => card.getType() === 'attachment',
            effect: ability.effects.addKeyword('Terminal')
        });
    }
}

Helya.code = '04091';

export default Helya;
