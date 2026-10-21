import PlotCard from '../../plotcard.js';

class ChampionsChallenge extends PlotCard {
    // Champion's Challenge (15049)
    // Reaction: After an opponent initiates a challenge against you, kneel a character with the
    // highest STR among character you control to end the challenge with no winner or loser. (Limit
    // once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallengeInitiated: (event) =>
                    event.challenge.initiatedAgainstPlayer === this.controller
            },
            limit: ability.limit.perPhase(1),
            cost: ability.costs.kneel(
                (card, context) =>
                    card.getType() === 'character' &&
                    card.getStrength() === this.highestStrength(context.player)
            ),
            message: {
                format: '{player} uses {source} and kneels {kneeledCard} to end the current challenge',
                args: { kneeledCard: (context) => context.costs.kneel }
            },
            handler: (context) => {
                context.event.challenge.cancelChallenge();
            }
        });
    }

    highestStrength(player) {
        let charactersInPlay = player.filterCardsInPlay((card) => card.getType() === 'character');
        let strengths = charactersInPlay.map((card) => card.getStrength());
        return Math.max(...strengths);
    }
}

ChampionsChallenge.code = '15049';

export default ChampionsChallenge;
