import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CleverFeint extends DrawCard {
    // Clever Feint (11070)
    // Action: Kneel your faction card to choose any number of cards you control with shadow. Return
    // each of those cards to shadows.
    setupCardAbilities(ability) {
        this.action({
            title: 'Return cards to shadows',
            cost: ability.costs.kneelFactionCard(),
            target: {
                mode: 'unlimited',
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
}

CleverFeint.code = '11070';

export default CleverFeint;
