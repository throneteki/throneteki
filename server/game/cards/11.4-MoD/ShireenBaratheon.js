import DrawCard from '../../drawcard.js';

class ShireenBaratheon extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove STR contribution',
            condition: () => this.game.isDuringChallenge() && this.isParticipating(),
            target: {
                cardCondition: (card) =>
                    card !== this && card.getType() === 'character' && card.isParticipating()
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to have {1} and {2} not contribute STR to the challenge',
                    this.controller,
                    this,
                    context.target
                );
                this.untilEndOfChallenge((ability) => ({
                    match: [this, context.target],
                    targetController: 'any',
                    effect: ability.effects.doesNotContributeStrength()
                }));
            },
            limit: ability.limit.perChallenge(1)
        });
    }
}

ShireenBaratheon.code = '11067';

export default ShireenBaratheon;
