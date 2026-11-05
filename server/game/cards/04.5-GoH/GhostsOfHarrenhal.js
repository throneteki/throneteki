import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class GhostsOfHarrenhal extends PlotCard {
    // Ghosts of Harrenhal (04100)
    // When Revealed: Put the top character in each player's dead pile into play.
    setupCardAbilities() {
        this.whenRevealed({
            message: {
                format: '{player} uses {source} to put {cards} into play',
                args: { cards: (context) => topDeadCharacters(context.game) }
            },
            gameAction: GameActions.simultaneously((context) =>
                topDeadCharacters(context.game).map((card) =>
                    GameActions.putIntoPlay({ player: card.owner, card })
                )
            )
        });
    }
}

function topDeadCharacters(game) {
    return game
        .getPlayersInFirstPlayerOrder()
        .map((player) => player.deadPile.filter((card) => card.getType() === 'character').at(-1))
        .filter((card) => !!card);
}

GhostsOfHarrenhal.code = '04100';

export default GhostsOfHarrenhal;
