import DrawCard from '../../drawcard.js';

class Gulltown extends DrawCard {
    // Gulltown (19019)
    // Limited.
    // Each player is considered to have 1 additional City plot card in their used pile.
    // +1 Income.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.dynamicUsedPlotsWithTrait(() => 1, 'City')
        });
        this.plotModifiers({
            gold: 1
        });
    }
}

Gulltown.code = '19019';

export default Gulltown;
