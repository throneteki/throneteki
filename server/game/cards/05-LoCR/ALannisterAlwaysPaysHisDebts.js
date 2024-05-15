import DrawCard from '../../drawcard.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';

class ALannisterAlwaysPaysHisDebts extends DrawCard {
    setupCardAbilities(ability) {
        this.tracker = ChallengeTracker.forPhase(this.game);

        this.action({
            max: ability.limit.perPhase(1),
            title: 'Raise challenge limit',
            chooseOpponent: (opponent) => this.hasLostChallengeAgainst(opponent),
            phase: 'challenge',
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    targetController: 'current',
                    effect: [
                        ability.effects.mayInitiateAdditionalChallenge(
                            'military',
                            (opponent) => opponent === context.opponent
                        ),
                        ability.effects.mayInitiateAdditionalChallenge(
                            'intrigue',
                            (opponent) => opponent === context.opponent
                        )
                    ]
                }));

                this.game.addMessage(
                    '{0} plays {1} to be able to initiate an additional {2} and {3} challenge against {4} this phase',
                    this.controller,
                    this,
                    'military',
                    'intrigue',
                    context.opponent
                );
            }
        });
    }

    hasLostChallengeAgainst(opponent) {
        return this.tracker.some({ winner: opponent, loser: this.controller });
    }
}

ALannisterAlwaysPaysHisDebts.code = '05022';

export default ALannisterAlwaysPaysHisDebts;
