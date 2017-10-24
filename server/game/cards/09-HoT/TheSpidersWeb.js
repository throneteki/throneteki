const PlotCard = require('../../plotcard.js');

class TheSpidersWeb extends PlotCard {
    setupCardAbilities(ability) {
        this.reaction({
            limit: ability.limit.perPhase(1),
            when: {
                onClaimApplied: event => event.player === this.controller && event.challenge.challengeType === 'intrigue'
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to be able to initiate an additional {2} challenge with claim raised by 1', this.controller, this, 'intrigue');
                this.untilEndOfPhase(ability => ({
                    targetType: 'player',
                    targetController: 'current',
                    effect: ability.effects.modifyChallengeTypeLimit('intrigue', 1)
                }));
                this.untilEndOfPhase(ability =>({
                    condition: () => (
                        this.game.currentChallenge &&
                        this.game.currentChallenge.challengeType === 'intrigue'
                    ),
                    match: card => card === this.controller.activePlot,
                    effect: ability.effects.modifyClaim(1)
                }));
            }
        });
    }
}

TheSpidersWeb.code = '09049';

module.exports = TheSpidersWeb;
