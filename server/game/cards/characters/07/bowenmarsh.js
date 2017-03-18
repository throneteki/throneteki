const DrawCard = require('../../../drawcard.js');

class BowenMarsh extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            reserve: 1
        });
        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.challengeType === 'intrigue',
            match: card => card.hasTrait('Steward') && card.getType() === 'character' && card.controller === this.controller,
            effect: ability.effects.addKeyword('Insight')
        });
    }
}

BowenMarsh.code = '07002';

module.exports = BowenMarsh;
