import DrawCard from '../../drawcard.js';

class SerBryceCaron extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                card.getType() === 'character' &&
                card.controller === this.controller &&
                card.hasTrait('Knight'),
            effect: ability.effects.modifyStrength(1)
        });
    }
}

SerBryceCaron.code = '19016';

export default SerBryceCaron;
