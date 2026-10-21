import DrawCard from '../../drawcard.js';

class Catspaw extends DrawCard {
    // Catspaw (11049)
    // Shadow (2).
    // Reaction: After Catspaw comes out of shadows, pay X gold to choose another character with
    // printed cost X or lower and return it to its owner's hand.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            cost: ability.costs.payXGold(
                () => this.getMinimumCost(),
                () => 99
            ),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    (context.xValue
                        ? card.getPrintedCost() <= context.xValue
                        : card.getPrintedCost() <= this.controller.getSpendableGold())
            },
            handler: (context) => {
                context.target.controller.returnCardToHand(context.target);
                this.game.addMessage(
                    "{0} uses {1} and pays {2} gold to return {3} to {4}'s hand",
                    context.player,
                    this,
                    context.costs.gold,
                    context.target,
                    context.target.owner
                );
            }
        });
    }

    getMinimumCost() {
        return this.game
            .filterCardsInPlay((card) => card !== this && card.getType() === 'character')
            .map((card) => card.getPrintedCost())
            .reduce((acc, val) => Math.min(acc, val), 0);
    }
}

Catspaw.code = '11049';

export default Catspaw;
