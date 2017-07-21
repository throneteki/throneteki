const DrawCard = require('../../../drawcard.js');

class WinterIsComing extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Raise claim by 1',
            max: ability.limit.perChallenge(1),
            condition: () => this.game.currentChallenge,
            handler: () => {
                this.untilEndOfChallenge(ability => ({
                    match: card => card === this.controller.activePlot,
                    effect: ability.effects.modifyClaim(1)
                }));

                this.game.addMessage('{0} uses {1} to raise the claim value on their revealed plot card by 1 until the end of the challenge', 
                    this.controller, this);
            }
        });
    }
}

WinterIsComing.code = '01159';

module.exports = WinterIsComing;
