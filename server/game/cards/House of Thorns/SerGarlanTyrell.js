const DrawCard = require('../../../drawcard.js');

class SerGarlanTyrell extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Raise claim',
            limit: ability.limit.perChallenge(1),
            condition: () => this.game.currentChallenge && this.game.currentChallenge.attackingPlayer === this.controller &&
                             this.game.currentChallenge.attackers.length === 1 && this.hasParticipatingKnight(),
            cost: ability.costs.discardFromHand(),
            handler: context => {
                this.untilEndOfChallenge(ability => ({
                    match: card => card === this.controller.activePlot,
                    effect: ability.effects.modifyClaim(1)
                }));
                this.game.addMessage('{0} uses {1} and discards {2} from their hand to raise the claim value on their revealed plot card by 1 until the end of the challenge',
                    this.controller, this, context.discardCostCard);
            }
        });
    }

    hasParticipatingKnight() {
        return this.controller.anyCardsInPlay(card => this.game.currentChallenge.isParticipating(card) &&
                                                      card.hasTrait('Knight') && 
                                                      card.getType() === 'character');
    }
}

SerGarlanTyrell.code = '09003';

module.exports = SerGarlanTyrell;
