import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CleverFeint extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Return cards to shadows',
            condition: () => this.controller.anyCardsInPlay((card) => card.isShadow()),
            cost: [
                ability.costs.kneelFactionCard(),
                ability.costs.payXGold(
                    () => 1,
                    () => this.getShadowCardCount()
                )
            ],
            target: {
                mode: 'exactly',
                numCards: (context) => context.xValue ?? 1,
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.controller &&
                    card.isShadow()
            },
            message: '{player} plays {source} to return {target} to shadows',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.simultaneously((context) =>
                        context.target.map((card) => GameActions.putIntoShadows({ card }))
                    ),
                    context
                );
            }
        });
    }

    getShadowCardCount() {
        return this.game.filterCardsInPlay(
            (card) => card.controller === this.controller && card.isShadow()
        ).length;
    }
}

CleverFeint.code = '17167';

export default CleverFeint;
