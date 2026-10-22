import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class CloseCall extends PlotCard {
    // Close Call (02120)
    // When Revealed: Move a character from your dead pile to your discard pile. Then, if there are
    // no Winter plot cards in play, draw 1 card.
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                type: 'select',
                cardCondition: (card, context) =>
                    card.getType() === 'character' &&
                    card.location === 'dead pile' &&
                    card.controller === context.player
            },
            message: '{player} uses {source} to move {target} to their discard pile',
            gameAction: GameActions.placeCard((context) => ({
                card: context.target,
                location: 'discard pile'
            })).then({
                condition: (context) => !context.game.anyPlotHasTrait('Winter'),
                message: 'Then {player} draws 1 card',
                gameAction: GameActions.drawCards((context) => ({
                    player: context.player,
                    amount: 1
                }))
            })
        });
    }
}

CloseCall.code = '02120';

export default CloseCall;
