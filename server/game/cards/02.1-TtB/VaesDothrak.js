const DrawCard = require('../../drawcard.js');

class VaesDothrak extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPlotsRevealed: (event) =>
                    event.plots.some((plot) => plot.controller === this.controller)
            },
            cost: ability.costs.discardFromHand(
                (card) => card.getType() === 'attachment' && this.hasPossibleLegalTarget(card)
            ),
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: (card, context) =>
                    !context.costs.discardFromHand ||
                    this.isValidTarget(card, context.costs.discardFromHand)
            },
            handler: (context) => {
                let card = context.target;
                card.controller.discardCard(card);
                this.game.addMessage(
                    '{0} uses {1} and discards {2} from their hand to discard {3} from play',
                    this.controller,
                    this,
                    context.costs.discardFromHand,
                    card
                );
            }
        });
    }

    hasPossibleLegalTarget(inHandAttachment) {
        return this.game.anyCardsInPlay((card) => this.isValidTarget(card, inHandAttachment));
    }

    isValidTarget(card, inHandAttachment) {
        return (
            card.location === 'play area' &&
            card.getType() === 'attachment' &&
            card.getPrintedCost() <= inHandAttachment.getPrintedCost()
        );
    }
}

VaesDothrak.code = '02014';

module.exports = VaesDothrak;
