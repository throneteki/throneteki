import DrawCard from '../../drawcard.js';

class PlazaOfPride extends DrawCard {
    // Plaza of Pride (07036)
    // Action: Kneel Plaza of Pride and discard a card from your hand to choose and stand a
    // character with printed cost X or lower. X is 3 higher than the printed cost of the discarded
    // card.
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand character',
            cost: [ability.costs.kneelSelf(), ability.costs.discardFromHand()],
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.kneeled &&
                    (!context.costs.discardFromHand ||
                        card.getPrintedCost() <= context.costs.discardFromHand.getPrintedCost() + 3)
            },
            handler: (context) => {
                context.target.controller.standCard(context.target);
                this.game.addMessage(
                    '{0} kneels {1} and discards {2} to stand {3}',
                    this.controller,
                    this,
                    context.costs.discardFromHand,
                    context.target
                );
            }
        });
    }
}

PlazaOfPride.code = '07036';

export default PlazaOfPride;
