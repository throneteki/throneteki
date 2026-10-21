import DrawCard from '../../drawcard.js';

class SerBryceCaron extends DrawCard {
    // Ser Bryce Caron (19016)
    // Each Knight character you control gets +1 STR.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                card.getType() === 'character' &&
                card.controller === context.source.controller &&
                card.hasTrait('Knight'),
            effect: ability.effects.modifyStrength(1)
        });
    }
}

SerBryceCaron.code = '19016';

export default SerBryceCaron;
