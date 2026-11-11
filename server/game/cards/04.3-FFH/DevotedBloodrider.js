import DrawCard from '../../drawcard.js';

class DevotedBloodrider extends DrawCard {
    // Devoted Bloodrider (04053)
    // Each Bloodrider character you control gets +1 STR.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.hasTrait('Bloodrider'),
            effect: ability.effects.modifyStrength(1)
        });
    }
}

DevotedBloodrider.code = '04053';

export default DevotedBloodrider;
