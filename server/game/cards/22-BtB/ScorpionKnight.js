const DrawCard = require('../../drawcard.js');

class ScorpionKnight extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onIconRemoved: event => event.applying
            },
            limit: ability.limit.perPhase(3),
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
