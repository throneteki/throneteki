import DrawCard from '../../drawcard.js';

class DrownedGodsApostle extends DrawCard {
    // Drowned God's Apostle (09027)
    // Reaction: After you win dominance, kill Drowned God's Apostle to put a non-unique [greyjoy]
    // character with printed cost 3 or lower into play from your dead pile.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDominanceDetermined: (event) => event.winner === this.controller
            },
            cost: ability.costs.killSelf(),
            target: {
                type: 'select',
                cardCondition: (card) =>
                    card.location === 'dead pile' &&
                    card.controller === this.controller &&
                    !card.isUnique() &&
                    card.isFaction('greyjoy') &&
                    card.getPrintedCost() <= 3
            },
            handler: (context) => {
                context.player.putIntoPlay(context.target);
                this.game.addMessage(
                    '{0} kills {1} to put {2} into play from their dead pile',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

DrownedGodsApostle.code = '09027';

export default DrownedGodsApostle;
