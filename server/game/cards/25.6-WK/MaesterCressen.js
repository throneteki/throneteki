import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MaesterCressen extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
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
        //reaction has to be split to avoid double trigger in scenario where Cressen dies immediately after coming out of shadows
        this.reaction({
            when: {
                onCardPlaced: (event) => event.card === this && event.card.location === 'dead pile'
            },
            location: ['dead pile'],
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
