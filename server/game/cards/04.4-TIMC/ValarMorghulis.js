const PlotCard = require('../../plotcard.js');
const GameActions = require('../../GameActions');

class ValarMorghulis extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            message: '{player} uses {source} to kill each character in play',
            gameAction: GameActions.kill(context => ({
                victims: context.game.getPlayersInFirstPlayerOrder().reduce((charactersToKill, player) => {
                    return charactersToKill.concat(
                        player.filterCardsInPlay({ type: 'character' }).map((card) => ({
                            card: card,
                            player: player
                        }))
                    );
                }, [])
            }))
        });
    }
}

ValarMorghulis.code = '04080';

module.exports = ValarMorghulis;
