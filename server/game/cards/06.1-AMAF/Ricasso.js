import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class Ricasso extends DrawCard {
    // Ricasso (06015)
    // Bestow (2). You are considered to have X additional plot cards in your used pile. X is the
    // number of gold Ricasso has.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.dynamicUsedPlots(
                (card, context) => context.source.tokens[Tokens.gold]
            )
        });
    }
}

Ricasso.code = '06015';

export default Ricasso;
