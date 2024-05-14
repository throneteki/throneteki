import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class Shagwell extends DrawCard {
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
