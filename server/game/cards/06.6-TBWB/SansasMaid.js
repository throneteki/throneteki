import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class SansasMaid extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.hasTrait('Lady') && card.getType() === 'character',
            effect: ability.effects.dynamicStrength(() => this.tokens[Tokens.gold])
        });
    }
}

SansasMaid.code = '06101';

export default SansasMaid;
