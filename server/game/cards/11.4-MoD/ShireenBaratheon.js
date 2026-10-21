import DrawCard from '../../drawcard.js';

class ShireenBaratheon extends DrawCard {
    // Shireen Baratheon (11067)
    // Shadow (3).
    // Action: During a challenge in which Shireen Baratheon is participating, choose a
    // participating character. That character and Shireen Baratheon do not contribute their STR to
    // the challenge. (Limit once per challenge.)
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
