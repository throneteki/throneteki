import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CaswellsKeep extends DrawCard {
    // Caswell's Keep (04064)
    // Reaction: After you reveal a plot card, choose a player. Look at the top 2 cards of that
    // player's deck. Place 1 of those cards on the bottom of that deck, and the other on top.
    setupCardAbilities() {
        this.reaction({
            when: {
                onPlotsRevealed: (event, context) =>
                    event.plots.some((plot) => plot.controller === context.player)
            },
            choosePlayer: (player) => player.drawDeck.length > 0,
            message: "{player} uses {source} to look at the top 2 cards of {chosenPlayer}'s deck",
            gameAction: GameActions.chooseCards({
                title: 'Choose card to place on bottom of deck',
                revealTargets: true,
                cardCondition: (card, context) =>
                    context.chosenPlayer.drawDeck.slice(0, 2).includes(card),
                gameAction: (card, context) =>
                    GameActions.placeCard({
                        card,
                        location: 'draw deck',
                        bottom: true,
                        player: context.player
                    })
            })
        });
    }
}

CaswellsKeep.code = '04064';

export default CaswellsKeep;
