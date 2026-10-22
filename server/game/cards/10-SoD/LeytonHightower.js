import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LeytonHightower extends DrawCard {
    // Leyton Hightower (10037)
    // Action: Kneel Leyton Hightower to put a non-limited [tyrell] card with printed cost 4 or
    // lower into play from your hand knelt.
    setupCardAbilities(ability) {
        this.action({
            title: 'Put card into play',
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) =>
                    card.location === 'hand' &&
                    card.controller === context.player &&
                    !card.isLimited() &&
                    card.isFaction('tyrell') &&
                    card.getPrintedCost() <= 4
            },
            message: '{player} kneels {source} to put {target} into play from their hand knelt',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target,
                kneeled: true
            }))
        });
    }
}

LeytonHightower.code = '10037';

export default LeytonHightower;
