import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class TheLongWinter extends PlotCard {
    // The Long Winter (03049)
    // When Revealed: Each player without a Summer plot revealed discards 1 power from a card he or
    // she controls.
    setupCardAbilities() {
        this.whenRevealed({
            message:
                '{player} uses {source} to have each player without a Summer plot revealed discard 1 power',
            gameAction: GameActions.chooseCards({
                players: (context) =>
                    context.game
                        .getPlayersInFirstPlayerOrder()
                        .filter((player) => !player.activePlot.hasTrait('Summer')),
                title: 'Select a card',
                cardCondition: (card, context) =>
                    ['active plot', 'faction', 'play area'].includes(card.location) &&
                    card.controller === context.choosingPlayer &&
                    card.getPower() > 0,
                gameAction: (card) => GameActions.discardPower({ card, amount: 1 })
            })
        });
    }
}

TheLongWinter.code = '03049';

export default TheLongWinter;
