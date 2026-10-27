import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class BuilderAtTheWall extends DrawCard {
    // Builder at the Wall (07016)
    // Marshaling Action: Kneel Builder at the Wall to reduce the cost of the next [thenightswatch]
    // attachment or location you marshal this phase by 1.
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to reduce',
            clickToActivate: true,
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            message:
                '{player} kneels {source} to reduce the cost of the next thenightswatch attachment or location by 1',
            gameAction: GameActions.lastingEffect(() => ({
                duration: 'untilEndOfPhase',
                targetController: 'current',
                effect: ability.effects.reduceNextMarshalledCardCost(
                    1,
                    (card) =>
                        card.isFaction('thenightswatch') &&
                        (card.getType() === 'attachment' || card.getType() === 'location')
                )
            }))
        });
    }
}

BuilderAtTheWall.code = '07016';

export default BuilderAtTheWall;
