import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import TextHelper from '../../TextHelper.js';

class CleverFeint extends DrawCard {
    // Clever Feint (17167)
    // Action: Kneel your faction card and pay X gold to choose X cards you control with shadow.
    // Return each of those cards to shadows.
    setupCardAbilities(ability) {
        this.action({
            title: 'Return cards to shadows',
            condition: (context) => context.player.anyCardsInPlay((card) => card.isShadow()),
            cost: [
                ability.costs.kneelFactionCard(),
                ability.costs.payXGold(
                    () => 1,
                    (context) => context.source.getShadowCardCount()
                )
            ],
            target: {
                activePromptTitle: (context) =>
                    `Select ${TextHelper.count(context.xValue ?? 1, 'card')}`,
                mode: 'exactly',
                numCards: (context) => context.xValue ?? 1,
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.player &&
                    card.isShadow()
            },
            message: {
                format: '{player} plays {source}, kneels their faction card and pays {xValue} to return {target} to shadows',
                args: { xValue: (context) => context.xValue }
            },
            gameAction: GameActions.simultaneously((context) =>
                context.target.map((card) => GameActions.putIntoShadows({ card }))
            )
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
