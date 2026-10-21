import PlotCard from '../../plotcard.js';
import { flatMap } from '../../../Array.js';

class ValarMorghulis extends PlotCard {
    // Valar Morghulis (04080)
    // When Revealed: Kill each character.
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                let players = this.game.getPlayersInFirstPlayerOrder();
                let characters = flatMap(players, (player) =>
                    player.filterCardsInPlay((card) => card.getType() === 'character')
                );
                this.game.killCharacters(characters);
            }
        });
    }
}

ValarMorghulis.code = '04080';

export default ValarMorghulis;
