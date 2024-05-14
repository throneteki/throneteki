import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheShavepate extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put character into play',
            phase: 'challenge',
            cost: ability.costs.payXGold(
                () => this.getMinimumCost(),
                () => 99
            ),
            target: {
                type: 'select',
                cardCondition: (card, context) =>
                    card.location === 'discard pile' &&
                    card.getType() === 'character' &&
                    card.controller === this.controller &&
                    context.player.canPutIntoPlay(card) &&
                    (context.xValue
                        ? card.getPrintedCost() <= context.xValue
                        : card.getPrintedCost() <= this.controller.getSpendableGold())
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.putIntoPlay((context) => ({
                        card: context.target
                    })),
                    context
                );
                this.game.addMessage(
                    '{0} uses {1} and pays {2} gold to put {3} into play from their discard pile',
                    context.player,
                    this,
                    context.goldCost,
                    context.target
                );
            },
            limit: ability.limit.perPhase(1)
        });
    }

    getMinimumCost() {
        return this.game
            .filterCardsInPlay(
                (card) => card.getType() === 'character' && card.location === 'discard pile'
            )
            .map((card) => card.getPrintedCost())
            .reduce((acc, val) => Math.min(acc, val), 0);
    }
}

TheShavepate.code = '15008';

export default TheShavepate;
