const DrawCard = require('../../drawcard.js');
const { Tokens } = require('../../Constants');

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

module.exports = Shagwell;
