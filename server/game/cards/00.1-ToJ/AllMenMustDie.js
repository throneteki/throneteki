import PlotCard from '../../plotcard.js';
import { flatMap } from '../../../Array.js';

class AllMenMustDie extends PlotCard {
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

AllMenMustDie.code = '00301';

export default AllMenMustDie;
