import DrawCard from '../../drawcard.js';

class Viserion extends DrawCard {
    // Viserion (01166)
    // No attachments.
    // Each Stormborn character you control gains stealth.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.hasTrait('Stormborn'),
            effect: ability.effects.addKeyword('Stealth')
        });
    }
}

Viserion.code = '01166';

export default Viserion;
