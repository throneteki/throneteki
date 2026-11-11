import DrawCard from '../../drawcard.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';
import GameActions from '../../GameActions/index.js';

class ALannisterAlwaysPaysHisDebts extends DrawCard {
    // A Lannister Always Pays His Debts (05022)
    // Challenges Action: Choose an opponent who has won a challenge against you this phase. You may
    // initiate an additional [military] and [intrigue] challenge against that player this phase.
    // (Max 1 per phase.)
    setupCardAbilities(ability) {
        const tracker = ChallengeTracker.forPhase(this.game);

        this.action({
            max: ability.limit.perPhase(1),
            title: 'Raise challenge limit',
            chooseOpponent: (opponent, context) =>
                tracker.some({ winner: opponent, loser: context.player }),
            phase: 'challenge',
            message:
                '{player} plays {source} to be able to initiate an additional military and intrigue challenge against {opponent} this phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
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
            }))
        });
    }
}

ALannisterAlwaysPaysHisDebts.code = '05022';

export default ALannisterAlwaysPaysHisDebts;
