const DrawCard = require('../../drawcard.js');
const { Tokens } = require('../../Constants');

class SansasMaid extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.hasTrait('Lady') && card.getType() === 'character',
            effect: ability.effects.dynamicStrength(() => this.tokens[Tokens.gold])
        });
    }
}

SansasMaid.code = '06101';

module.exports = SansasMaid;
