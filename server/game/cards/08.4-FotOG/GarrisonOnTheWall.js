import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GarrisonOnTheWall extends DrawCard {
    // Garrison on the Wall (08065)
    // No attachments.
    // Reaction: After Garrison on the Wall is declared as a defender, kneel a non-[thenightswatch]
    // character to stand Garrison on the Wall.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDeclaredAsDefender: (event, context) => event.card === context.source
            },
            cost: ability.costs.kneel(
                (card) => !card.isFaction('thenightswatch') && card.getType() === 'character'
            ),
            message: '{player} kneels {costs.kneel} to stand {source}',
            gameAction: GameActions.standCard((context) => ({ card: context.source }))
        });
    }
}

GarrisonOnTheWall.code = '08065';

export default GarrisonOnTheWall;
