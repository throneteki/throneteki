import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class FallenFromFavor extends PlotCard {
    // Fallen from Favor (03047)
    // When Revealed: Sacrifice a character you control.
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                type: 'select',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.player &&
                    card.getType() === 'character'
            },
            message: {
                format: '{player} sacrifices {card} for {source}',
                args: { card: (context) => context.target }
            },
            gameAction: GameActions.sacrificeCard((context) => ({ card: context.target }))
        });
    }
}

FallenFromFavor.code = '03047';

export default FallenFromFavor;
