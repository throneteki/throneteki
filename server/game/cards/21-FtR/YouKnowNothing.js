const DrawCard = require('../../drawcard');

class YouKnowNothing extends DrawCard {
    setupCardAbilities() {
        this.action({
            phase: 'challenge',
            message: {
                format: "{player} plays {source} to have each opponent's non-Army character lose all keywords"
            },
            handler: () => {
                this.untilEndOfPhase((ability) => ({
                    match: (card) => !card.hasTrait('Army') && card.getType() === 'character',
                    targetController: 'opponent',
                    effect: ability.effects.losesAllKeywords()
                }));
            }
        });
    }
}

YouKnowNothing.code = '21015';

module.exports = YouKnowNothing;
