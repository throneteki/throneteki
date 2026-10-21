import DrawCard from '../../drawcard.js';

class GarrisonOnTheWall extends DrawCard {
    // Garrison on the Wall (08065)
    // No attachments.
    // Reaction: After Garrison on the Wall is declared as a defender, kneel a non-[thenightswatch]
    // character to stand Garrison on the Wall.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDeclaredAsDefender: (event) => event.card === this
            },
            cost: ability.costs.kneel(
                (card) => !card.isFaction('thenightswatch') && card.getType() === 'character'
            ),
            handler: (context) => {
                context.player.standCard(this);
                this.game.addMessage(
                    '{0} kneels {1} to stand {2}',
                    context.player,
                    context.costs.kneel,
                    this
                );
            }
        });
    }
}

GarrisonOnTheWall.code = '08065';

export default GarrisonOnTheWall;
