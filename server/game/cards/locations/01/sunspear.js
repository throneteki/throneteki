const DrawCard = require('../../../drawcard.js');

class Sunspear extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.loser === this.controller && challenge.defendingPlayer === this.controller
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                let challengeType = this.game.currentChallenge.challengeType;
                this.game.addMessage('{0} kneels {1} to raise the claim on their plot card during {2} challenges by 1 until the end of the phase', 
                    this.controller, this, challengeType);
                this.untilEndOfPhase(ability => ({
                    condition: () => (
                        this.game.currentChallenge &&
                        this.game.currentChallenge.challengeType === challengeType
                    ),
                    match: this.controller.activePlot,
                    effect: ability.effects.modifyClaim(1)
                }));
            }
        });
    }
}

Sunspear.code = '01117';

module.exports = Sunspear;
