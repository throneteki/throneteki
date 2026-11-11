import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class DrownedGodsApostle extends DrawCard {
    // Drowned God's Apostle (09027)
    // Reaction: After you win dominance, kill Drowned God's Apostle to put a non-unique [greyjoy]
    // character with printed cost 3 or lower into play from your dead pile.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDominanceDetermined: (event, context) =>
                    event.winner === context.source.controller
            },
            cost: ability.costs.killSelf(),
            target: {
                type: 'select',
                cardCondition: (card, context) =>
                    card.location === 'dead pile' &&
                    card.controller === context.source.controller &&
                    !card.isUnique() &&
                    card.isFaction('greyjoy') &&
                    card.getPrintedCost() <= 3
            },
            message: '{player} kills {source} to put {target} into play from their dead pile',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            }))
        });
    }
}

DrownedGodsApostle.code = '09027';

export default DrownedGodsApostle;
