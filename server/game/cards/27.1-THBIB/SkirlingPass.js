import DrawCard from '../../drawcard.js';

class SkirlingPass extends DrawCard {
    // Skirling Pass (27010)
    // While Skirling Pass is standing, each non-Wildling character loses stealth.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => !context.source.kneeled,
            targetController: 'any',
            match: (card) => card.getType() === 'character' && !card.hasTrait('Wildling'),
            effect: ability.effects.removeKeyword('stealth')
        });
    }
}

SkirlingPass.code = '27010';

export default SkirlingPass;
