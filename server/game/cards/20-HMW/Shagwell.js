import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class Shagwell extends DrawCard {
    // Shagwell (20045)
    // Bestow (1).
    // While a character with 1 or more gold has a keyword, each Fool character with 1 or more gold
    // gains that keyword.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.hasTrait('Fool') && card.hasToken(Tokens.gold),
            targetController: 'any',
            effect: ability.effects.dynamicKeywordSources(
                (card) => card.getType() === 'character' && card.hasToken(Tokens.gold)
            )
        });
    }
}

Shagwell.code = '20045';

export default Shagwell;
