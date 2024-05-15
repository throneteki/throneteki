import DrawCard from '../../drawcard.js';

class GarrisonOnTheWall extends DrawCard {
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
