import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MaesterJoseran extends DrawCard {
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
