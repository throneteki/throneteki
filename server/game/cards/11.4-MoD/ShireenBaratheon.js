import GameActions from '../../GameActions/index.js';
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
            condition: (context) =>
                context.game.isDuringChallenge() && context.source.isParticipating(),
            target: {
                cardCondition: (card, context) =>
                    card !== context.source &&
                    card.getType() === 'character' &&
                    card.isParticipating()
            },
            message:
                '{player} uses {source} to have {source} and {target} not contribute STR to the challenge',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: [context.source, context.target],
                targetController: 'any',
                effect: ability.effects.doesNotContributeStrength()
            })),
            limit: ability.limit.perChallenge(1)
        });
    }
}

ShireenBaratheon.code = '11067';

export default ShireenBaratheon;
