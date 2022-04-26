const DrawCard = require('../../drawcard.js');

class ScorpionKnight extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onIconLost: event => event.applying
            },
            limit: ability.limit.perPhase(3),
            message: '{player} uses {source} to gain +1 STR until the end of the phase',
            handler: () => {
                this.untilEndOfPhase(ability => ({
                    match: this,
                    effect: ability.effects.modifyStrength(1)
                }));
            }
        });
    }
}

ScorpionKnight.code = '22011';

module.exports = ScorpionKnight;
