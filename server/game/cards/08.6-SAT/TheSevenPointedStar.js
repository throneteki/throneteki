import DrawCard from '../../drawcard.js';

class TheSevenPointedStar extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addTrait('The Seven')
        });

        this.action({
            title: 'Reduce cost',
            phase: 'marshal',
            cost: ability.costs.kneelParent(),
            handler: (context) => {
                let currentController = context.player;
                this.game.addMessage(
                    '{0} uses {1} and kneels {2} to reduce the cost of the next The Seven character by 2',
                    currentController,
                    this,
                    context.costs.kneel
                );
                this.untilEndOfPhase((ability) => ({
                    condition: () => !context.abilityDeactivated,
                    targetController: 'current',
                    match: (player) => player === currentController,
                    effect: ability.effects.reduceNextMarshalledCardCost(2, (card) =>
                        card.hasTrait('The Seven')
                    )
                }));
            }
        });
    }
}

TheSevenPointedStar.code = '08119';

export default TheSevenPointedStar;
