import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class SansasMaid extends DrawCard {
    // Sansa's Maid (06101)
    // Bestow (3).
    // Each Lady character you control gets +1 STR for each gold Sansa's Maid has.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.hasTrait('Lady') && card.getType() === 'character',
            effect: ability.effects.dynamicStrength(() => this.tokens[Tokens.gold])
        });
    }
}

SansasMaid.code = '06101';

export default SansasMaid;
