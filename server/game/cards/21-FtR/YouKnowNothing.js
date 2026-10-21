import DrawCard from '../../drawcard.js';

class YouKnowNothing extends DrawCard {
    // You Know Nothing (21015)
    // Challenges Action: Until the end of the phase, each non-Army character an opponent controls
    // loses all keywords.
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

export default YouKnowNothing;
