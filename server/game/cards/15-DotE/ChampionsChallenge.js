const PlotCard = require('../../plotcard');

class ChampionsChallenge extends PlotCard {
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

module.exports = ChampionsChallenge;
