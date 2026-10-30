import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class ChampionsChallenge extends PlotCard {
    // Champion's Challenge (15049)
    // Reaction: After an opponent initiates a challenge against you, kneel a character with the
    // highest STR among character you control to end the challenge with no winner or loser. (Limit
    // once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallengeInitiated: (event, context) =>
                    event.challenge.initiatedAgainstPlayer === context.player
            },
            limit: ability.limit.perPhase(1),
            cost: ability.costs.kneel(
                (card, context) =>
                    card.getType() === 'character' &&
                    card.getStrength() === highestStrength(context.player)
            ),
            message: {
                format: '{player} uses {source} and kneels {kneeledCard} to end the current challenge',
                args: { kneeledCard: (context) => context.costs.kneel }
            },
            gameAction: GameActions.endChallenge((context) => ({
                challenge: context.event.challenge
            }))
        });
    }
}

function highestStrength(player) {
    const strengths = player
        .filterCardsInPlay((card) => card.getType() === 'character')
        .map((card) => card.getStrength());
    return Math.max(...strengths);
}

ChampionsChallenge.code = '15049';

export default ChampionsChallenge;
