import DrawCard from '../../drawcard.js';
import { ChallengeTracker } from '../../EventTrackers/ChallengeTracker.js';
import GameActions from '../../GameActions/index.js';

class AGameOfCyvasse extends DrawCard {
    setupCardAbilities(ability) {
        this.tracker = ChallengeTracker.forPhase(this.game);

        this.action({
            title: 'Restrict declared characters in next intrigue challenge',
            phase: 'challenge',
            max: ability.limit.perPhase(1),
            message:
                "{player} plays {source} so each player cannot declare more than 1 character as an attacker or defender in {player}'s next intrigue challenge this phase",
            gameAction: GameActions.simultaneously((context) => {
                const isThatChallenge = this.nextIntrigueChallengeMatcher(context.player);

                return [
                    GameActions.lastingEffect(() => ({
                        duration: 'untilEndOfPhase',
                        targetController: 'any',
                        condition: () => isThatChallenge(this.game.currentChallenge),
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

    nextIntrigueChallengeMatcher(player) {
        const current = this.game.currentChallenge;
        const challengesBefore = current ? current.totalNumber : this.tracker.count({});
        const isLaterIntrigueChallenge = (challenge) =>
            challenge.isMatch({ attackingPlayer: player, challengeType: 'intrigue' }) &&
            challenge.totalNumber > challengesBefore;

        return (challenge) =>
            !!challenge &&
            isLaterIntrigueChallenge(challenge) &&
            !this.tracker
                .filter({ attackingPlayer: player, challengeType: 'intrigue' })
                .some(
                    (earlier) =>
                        earlier !== challenge &&
                        isLaterIntrigueChallenge(earlier) &&
                        earlier.totalNumber < challenge.totalNumber
                );
    }
}

AGameOfCyvasse.code = '27028';

export default AGameOfCyvasse;
