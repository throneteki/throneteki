import DrawCard from '../../drawcard.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';
import GameActions from '../../GameActions/index.js';

class TheFowlerTwins extends DrawCard {
    // The Fowler Twins (13035)
    // Action: Choose a character. That character must be declared as an attacker or defender in the
    // next challenge initiated this phase, if able. (Limit once per phase.)
    setupCardAbilities(ability) {
        const tracker = ChallengeTracker.forPhase(this.game);

        this.action({
            title: 'Force participant',
            target: {
                cardCondition: { location: 'play area', type: 'character' }
            },
            limit: ability.limit.perPhase(1),
            message:
                '{player} uses {source} to force {target} to be declared as a participant in the next challenge initated this phase',
            gameAction: GameActions.lastingEffect((context) => {
                const nextChallenge =
                    Math.max(...tracker.challenges.map((challenge) => challenge.totalNumber), 0) +
                    1;
                return {
                    duration: 'untilEndOfPhase',
                    condition: () => context.game.isDuringChallenge({ totalNumber: nextChallenge }),
                    match: context.target,
                    effect: [
                        ability.effects.mustBeDeclaredAsAttacker(),
                        ability.effects.mustBeDeclaredAsDefender()
                    ]
                };
            })
        });
    }
}

TheFowlerTwins.code = '13035';

export default TheFowlerTwins;
