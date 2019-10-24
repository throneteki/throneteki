const PlotCard = require('../../plotcard');

class ChampionsChallenge extends PlotCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallengeInitiated: event => event.challenge.defendingPlayer === this.controller
            },
            cost: ability.costs.kneel((card, context) => card.getType() === 'character' && card.getStrength() === this.highestStrength(context.player)),
            message: '{player} uses {source} and kneels {costs.kneel} to end the current challenge',
            handler: context => {
                context.event.challenge.cancelChallenge();
            }
        });
    }

    highestStrength(player) {
        let charactersInPlay = player.filterCardsInPlay(card => card.getType() === 'character');
        let strengths = charactersInPlay.map(card => card.getStrength());
        return Math.max(...strengths);
    }
}

ChampionsChallenge.code = '15049';

module.exports = ChampionsChallenge;

