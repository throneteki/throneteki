const DrawCard = require('../../drawcard.js');

class ThereIsMyClaim extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Raise claim value by 1',
            max: ability.limit.perChallenge(1),
            phase: 'challenge',
            condition: () => this.game.isDuringChallenge(),
            cost: ability.costs.revealCards(4, card => card.getType() === 'character' && card.isFaction('tyrell') && card.location === 'hand'),
            handler: context => {
                this.untilEndOfChallenge(ability => ({
                    match: card => card === this.controller.activePlot,
                    effect: ability.effects.modifyClaim(1)
                }));

                this.game.addMessage('{0} uses {1} and reveals {2} from their hand to raise the claim value on their revealed plot card by 1 until the end of the challenge',
                    this.controller, this, context.costs.reveal);
            }
        });
    }
}

ThereIsMyClaim.code = '04024';

module.exports = ThereIsMyClaim;
