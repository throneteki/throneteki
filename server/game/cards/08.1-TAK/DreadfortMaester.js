const DrawCard = require('../../drawcard.js');

class DreadfortMaester extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallengeInitiated: event => event.challenge.attackingPlayer === this.controller && ['military', 'intrigue'].includes(event.challenge.challengeType)
            },
            cost: ability.costs.sacrificeSelf(),
            handler: () => {
                this.untilEndOfChallenge(ability => ({
                    match: card => card === this.controller.activePlot,
                    effect: ability.effects.modifyClaim(1)
                }));

                this.game.addMessage('{0} sacrifices {1} to raise the claim value on their revealed plot card by 1 until the end of the challenge',
                    this.controller, this);
            }
        });
    }
}

DreadfortMaester.code = '08002';

module.exports = DreadfortMaester;
