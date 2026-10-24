import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheSevenPointedStar extends DrawCard {
    // The Seven-Pointed Star (08119)
    // Attached character gains The Seven trait.
    // Marshaling Action: Kneel attached character to reduce the cost of the next The Seven card you
    // marshal this phase by 2.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addTrait('The Seven')
        });

        this.action({
            title: 'Reduce cost',
            phase: 'marshal',
            cost: ability.costs.kneelParent(),
            message:
                '{player} uses {source} and kneels {costs.kneel} to reduce the cost of the next The Seven card by 2',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                condition: () => !context.abilityDeactivated,
                targetController: 'current',
                match: (player) => player === context.player,
                effect: ability.effects.reduceNextMarshalledCardCost(2, (card) =>
                    card.hasTrait('The Seven')
                )
            }))
        });
    }
}

TheSevenPointedStar.code = '08119';

export default TheSevenPointedStar;
