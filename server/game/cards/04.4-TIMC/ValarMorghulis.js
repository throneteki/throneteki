const PlotCard = require('../../plotcard.js');
const GameActions = require('../../GameActions');

class ValarMorghulis extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            message: '{player} uses {source} to kill each character in play',
            gameAction: GameActions.simultaneously(context =>
                context.game.getPlayersInFirstPlayerOrder().reduce((charactersToKill, player) => {
                    return charactersToKill.concat(player.filterCardsInPlay(card => card.getType() === 'character'));
                }, []).map(characterToKill => GameActions.kill({ card: characterToKill })))
        });
    }
}

ValarMorghulis.code = '04080';

module.exports = ValarMorghulis;
