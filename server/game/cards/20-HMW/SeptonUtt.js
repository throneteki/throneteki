import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class SeptonUtt extends DrawCard {
    // Septon Utt (20043)
    // Bestow (2).
    // Each unique character you control with 2 or more gold gains insight.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                card.getType() === 'character' && card.isUnique() && card.tokens[Tokens.gold] >= 2,
            effect: ability.effects.addKeyword('Insight')
        });
    }
}

SeptonUtt.code = '20043';

export default SeptonUtt;
