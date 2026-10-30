import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheKingsroad extends DrawCard {
    // The Kingsroad (01039)
    // Limited.
    // Marshaling Action: Kneel and sacrifice The Kingsroad to reduce the cost of the next character
    // you marshal this phase by 3.
    // +1 Initiative.
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: 1
        });
        this.action({
            title: 'Kneel and sacrifice',
            clickToActivate: true,
            phase: 'marshal',
            cost: [ability.costs.kneelSelf(), ability.costs.sacrificeSelf()],
            message:
                '{player} kneels and sacrifices {source} to reduce the cost of the next character they marshal this phase by 3',
            // The Kingsroad is in its owner's discard pile by the time the reduction is used, so
            // the reduction is matched to the player who used it, who may not be its owner.
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                targetController: 'any',
                match: (player) => player === context.player,
                effect: ability.effects.reduceNextMarshalledCardCost(
                    3,
                    (card) => card.getType() === 'character'
                )
            }))
        });
    }
}

TheKingsroad.code = '01039';

export default TheKingsroad;
