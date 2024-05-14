import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class Ricasso extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.dynamicUsedPlots(() => this.tokens[Tokens.gold])
        });
    }
}

Ricasso.code = '06015';

export default Ricasso;
