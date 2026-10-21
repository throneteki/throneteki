import { Tokens } from '../../Constants/index.js';
import DrawCard from '../../drawcard.js';

class BlackBalaq extends DrawCard {
    // Black Balaq (25073)
    // Bestow (1).
    // While Black Balaq is attacking, each defending character gets -X STR. X is the number of gold
    // Black Balaq has.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.isAttacking(),
            match: (card) => card.isDefending(),
            targetController: 'opponent',
            effect: ability.effects.dynamicStrength(
                (card, context) => -context.source.tokens[Tokens.gold]
            )
        });
    }
}

BlackBalaq.code = '25073';

export default BlackBalaq;
