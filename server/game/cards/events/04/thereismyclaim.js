const DrawCard = require('../../../drawcard.js');

class ThereIsMyClaim extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Raise claim value by 1',
            max: ability.limit.perChallenge(1),
            phase: 'challenge',
            condition: () => this.game.currentChallenge,
            cost: ability.costs.revealCards(4, card => card.getType() === 'character' && card.isFaction('tyrell')),
            handler: () => {
                this.untilEndOfChallenge(ability => ({
                    match: card => card === this.controller.activePlot,
                    effect: ability.effects.modifyClaim(1)
                }));

                this.game.addMessage('{0} uses {1} to raise their claim value until the end of the challenge',
                                     this.controller, this);
            }
        });
    }
}

ThereIsMyClaim.code = '04024';

module.exports = ThereIsMyClaim;
