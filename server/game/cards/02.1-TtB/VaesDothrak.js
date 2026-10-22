import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class VaesDothrak extends DrawCard {
    // Vaes Dothrak (02014)
    // Reaction: After you reveal a plot card, discard an attachment from your hand to choose an
    // attachment with equal or lower printed cost, and discard it from play.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPlotsRevealed: (event, context) =>
                    event.plots.some((plot) => plot.controller === context.source.controller)
            },
            cost: ability.costs.discardFromHand(
                (card, context) =>
                    card.getType() === 'attachment' && context.source.hasPossibleLegalTarget(card)
            ),
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: (card, context) =>
                    !context.costs.discardFromHand ||
                    context.source.isValidTarget(card, context.costs.discardFromHand)
            },
            message: {
                format: '{player} uses {source} and discards {costs.discardFromHand} from their hand to discard {card} from play',
                args: { card: (context) => context.target }
            },
            gameAction: GameActions.discardCard((context) => ({ card: context.target }))
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

export default VaesDothrak;
