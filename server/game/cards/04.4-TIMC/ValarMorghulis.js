import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class ValarMorghulis extends PlotCard {
    // Valar Morghulis (04080)
    // When Revealed: Kill each character.
    setupCardAbilities() {
        this.whenRevealed({
            message: '{player} uses {source} to kill each character',
            gameAction: GameActions.simultaneously((context) =>
                context.game
                    .getPlayersInFirstPlayerOrder()
                    .flatMap((player) =>
                        player.filterCardsInPlay((card) => card.getType() === 'character')
                    )
                    .map((card) => GameActions.kill({ card }))
            )
        });
    }
}

ValarMorghulis.code = '04080';

export default ValarMorghulis;
