import DrawCard from '../../drawcard.js';
import { ChallengeTracker } from '../../EventTrackers/ChallengeTracker.js';
import GameActions from '../../GameActions/index.js';

class AGameOfCyvasse extends DrawCard {
    // A Game of Cyvasse (27028)
    // Challenges Action: Each player cannot declare more than 1 character as an attacker or
    // defender in the next [intrigue] challenge you initiate this phase. If you win that challenge,
    // you may initiate an additional [intrigue] challenge this phase. (Max 1 per phase.)
    setupCardAbilities(ability) {
        const tracker = ChallengeTracker.forPhase(this.game);

        this.action({
            title: 'Restrict declared characters in next intrigue challenge',
            phase: 'challenge',
            max: ability.limit.perPhase(1),
            message:
                "{player} plays {source} so each player cannot declare more than 1 character as an attacker or defender in {player}'s next intrigue challenge this phase",
            gameAction: GameActions.simultaneously((context) => {
                const isThatChallenge = nextIntrigueChallengeMatcher(tracker, context);

                return [
                    GameActions.lastingEffect(() => ({
                        duration: 'untilEndOfPhase',
                        targetController: 'any',
                        condition: () => isThatChallenge(context.game.currentChallenge),
                        effect: [
                            ability.effects.setAttackerMaximum(1),
                            ability.effects.setDefenderMaximum(1)
                        ]
                    })),
                    GameActions.delayedEffect({
                        duration: 'untilEndOfPhase',
                        when: {
                            afterChallenge: (event) =>
                                isThatChallenge(event.challenge) &&
                                event.challenge.winner === context.player
                        },
                        message:
                            '{player} wins the challenge and may initiate an additional intrigue challenge this phase',
                        gameAction: GameActions.lastingEffect(() => ({
                            duration: 'untilEndOfPhase',
                            targetController: 'any',
                            match: (player) => player === context.player,
                            effect: ability.effects.mayInitiateAdditionalChallenge('intrigue')
                        }))
                    })
                ];
            })
        });
    }
}

function nextIntrigueChallengeMatcher(tracker, context) {
    const player = context.player;
    const current = context.game.currentChallenge;
    const challengesBefore = current ? current.totalNumber : tracker.count({});
    const isLaterIntrigueChallenge = (challenge) =>
        challenge.isMatch({ attackingPlayer: player, challengeType: 'intrigue' }) &&
        challenge.totalNumber > challengesBefore;

    return (challenge) =>
        !!challenge &&
        isLaterIntrigueChallenge(challenge) &&
        !tracker
            .filter({ attackingPlayer: player, challengeType: 'intrigue' })
            .some(
                (earlier) =>
                    earlier !== challenge &&
                    isLaterIntrigueChallenge(earlier) &&
                    earlier.totalNumber < challenge.totalNumber
            );
}

AGameOfCyvasse.code = '27028';

export default AGameOfCyvasse;
