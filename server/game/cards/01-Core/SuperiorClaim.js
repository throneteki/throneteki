import DrawCard from '../../drawcard.js';

class SuperiorClaim extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                afterChallenge: (event) =>
                    event.challenge.challengeType === 'power' &&
                    event.challenge.winner === this.controller &&
                    event.challenge.strengthDifference >= 5 &&
                    this.controller.canGainFactionPower()
            },
            handler: () => {
                this.game.addPower(this.controller, 2);
                this.game.addMessage(
                    '{0} plays {1} to gain 2 power for their faction',
                    this.controller,
                    this
                );
            }
        });
    }
}

SuperiorClaim.code = '01043';

export default SuperiorClaim;
