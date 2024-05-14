const PlotCard = require('../../plotcard.js');
const { flatMap } = require('../../../Array');

class ValarMorghulis extends PlotCard {
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

module.exports = ValarMorghulis;
