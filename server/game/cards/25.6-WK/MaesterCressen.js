import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MaesterCressen extends DrawCard {
    // Maester Cressen (25101)
    // Shadow (1).
    // Reaction: After Maester Cressen comes out of shadows or enters your dead pile, place the top
    // 2 cards of your deck facedown under your agenda.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) =>
                    event.card === this && event.card.location === 'play area',
                onCardPlaced: (event) => event.card === this && event.card.location === 'dead pile'
            },
            location: ['dead pile', 'play area'],
            message:
                '{player} uses {source} to place the top 2 cards of their deck under their agenda',
            gameAction: GameActions.simultaneously((context) =>
                context.player.drawDeck.slice(0, 2).map((card) =>
                    GameActions.placeCardUnderneath({
                        card,
                        parentCard: context.player.agenda,
                        facedown: false
                    })
                )
            )
        });
    }
}

MaesterCressen.code = '25101';

export default MaesterCressen;
