const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class VaesDothrak extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPlotsRevealed: () => this.hasPossibleLegalTarget()
            },
            cost: ability.costs.discardFromHand(card => card.getType() === 'attachment'),
            handler: context => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select an attachment',
                    source: this,
                    cardCondition: card => (
                        card.location === 'play area' && 
                        card.getType() === 'attachment' && 
                        card.getCost(true) <= context.discardCostCard.getCost(true)),
                    onSelect: (p, card) => {
                        card.controller.discardCard(card);
                        this.game.addMessage('{0} uses {1} and discards {2} from their hand to discard {3} from play', 
                                              this.controller, this, context.discardCostCard, card);
                        
                        return true;
                    }
                });
            }
        });
    }

    hasPossibleLegalTarget() {
        let attachmentsInHand = this.controller.findCards(this.controller.hand, card => card.getType() === 'attachment');
        let attachmentsInHandCosts = _.map(attachmentsInHand, card => card.getCost(true));
        let attachmentsInHandHighestCost = _.max(attachmentsInHandCosts);

        let attachmentsInPlay = this.game.findAnyCardsInPlay(card => card.getType() === 'attachment');
        let attachmentsInPlayCosts = _.map(attachmentsInPlay, card => card.getCost(true));
        let attachmentsInPlayLowestCost = _.min(attachmentsInPlayCosts);

        return attachmentsInHandHighestCost >= attachmentsInPlayLowestCost;
    }
}

VaesDothrak.code = '02014';

module.exports = VaesDothrak;
