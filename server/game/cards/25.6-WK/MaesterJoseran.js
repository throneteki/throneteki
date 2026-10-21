import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MaesterJoseran extends DrawCard {
    // Maester Joseran (25103)
    // Reaction: After you become the first player, each player places the top card of their deck
    // facedown under their agenda.
    setupCardAbilities() {
        this.reaction({
            when: {
                onFirstPlayerDetermined: (event) => this.controller === event.player
            },
            message:
                '{player} uses {source} to have each player put the top card of their deck facedown under their agenda',
            gameAction: GameActions.simultaneously(() =>
                this.game.getPlayers().map((player) =>
                    GameActions.placeCardUnderneath({
                        card: player.drawDeck[0],
                        parentCard: player.agenda,
                        facedown: false
                    })
                )
            )
        });
    }
}

MaesterJoseran.code = '25103';

export default MaesterJoseran;
