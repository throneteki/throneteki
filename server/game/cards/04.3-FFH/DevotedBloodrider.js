import DrawCard from '../../drawcard.js';

class DevotedBloodrider extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.hasTrait('Bloodrider'),
            effect: ability.effects.modifyStrength(1)
        });
    }
}

DevotedBloodrider.code = '04053';

export default DevotedBloodrider;
