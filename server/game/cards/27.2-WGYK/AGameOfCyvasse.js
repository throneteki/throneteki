import DrawCard from '../../drawcard.js';

class AGameOfCyvasse extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Restrict declared characters in next intrigue challenge',
            phase: 'challenge',
            max: ability.limit.perPhase(1),
            message:
                "{player} plays {source} so each player cannot declare more than 1 character as an attacker or defender in {player}'s next intrigue challenge this phase",
            handler: (context) => {
                const player = context.player;
                let markedChallenge = null;

                this.untilEndOfPhase((ability) => ({
                    targetController: 'any',
                    condition: () => {
                        const challenge = this.game.currentChallenge;
                        if (!challenge) {
                            return false;
                        }

                        if (
                            !markedChallenge &&
                            challenge.attackingPlayer === player &&
                            challenge.challengeType === 'intrigue'
                        ) {
                            markedChallenge = challenge;
                        }

                        return challenge === markedChallenge;
                    },
                    effect: [
                        ability.effects.setAttackerMaximum(1),
                        ability.effects.setDefenderMaximum(1)
                    ]
                }));

                const challengeListener = (event) => {
                    if (!markedChallenge || event.challenge !== markedChallenge) {
                        return;
                    }

                    this.game.removeListener('afterChallenge', challengeListener);
                    this.game.removeListener('onPhaseEnded', cleanupListener);

                    if (event.challenge.winner === player) {
                        this.untilEndOfPhase((ability) => ({
                            targetController: 'any',
                            match: (target) => target === player,
                            effect: ability.effects.mayInitiateAdditionalChallenge('intrigue')
                        }));
                        this.game.addMessage(
                            '{0} wins the challenge and may initiate an additional intrigue challenge this phase',
                            player
                        );
                    }
                };
                const cleanupListener = () => {
                    this.game.removeListener('afterChallenge', challengeListener);
                };

                this.game.on('afterChallenge', challengeListener);
                this.game.once('onPhaseEnded', cleanupListener);
            }
        });
    }
}

AGameOfCyvasse.code = '27028';

export default AGameOfCyvasse;
