const DrawCard = require('../../drawcard');
const { ChallengeTracker } = require('../../EventTrackers');

class TheFowlerTwins extends DrawCard {
    setupCardAbilities(ability) {
        this.tracker = ChallengeTracker.forPhase(this.game);

        this.action({
            title: 'Force participant',
            target: {
                cardCondition: { location: 'play area', type: 'character' }
            },
            limit: ability.limit.perPhase(1),
            message:
                '{player} uses {source} to force {target} to be declared as a participant in the next challenge initated this phase',
            handler: (context) => {
                let currentTotalNumber = Math.max(
                    ...this.tracker.challenges.map((challenge) => challenge.totalNumber),
                    0
                );

                this.untilEndOfPhase((ability) => ({
                    condition: () =>
                        this.game.isDuringChallenge({ totalNumber: currentTotalNumber + 1 }),
                    match: context.target,
                    effect: [
                        ability.effects.mustBeDeclaredAsAttacker(),
                        ability.effects.mustBeDeclaredAsDefender()
                    ]
                }));
            }
        });
    }
}

TheFowlerTwins.code = '13035';

module.exports = TheFowlerTwins;
