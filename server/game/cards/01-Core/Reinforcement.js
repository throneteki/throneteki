import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class Reinforcements extends PlotCard {
    // Reinforcements (01020)
    // When Revealed: Choose a character with printed cost 5 or lower in your hand or discard pile,
    // and put it into play.
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                cardCondition: (card, context) =>
                    context.player === card.controller &&
                    card.getPrintedCost() <= 5 &&
                    card.getType() === 'character' &&
                    ['hand', 'discard pile'].includes(card.location) &&
                    context.player.canPutIntoPlay(card)
            },
            message: {
                format: '{player} uses {source} to put {target} into play from their {location}',
                args: { location: (context) => context.target.location }
            },
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            }))
        });
    }
}

Reinforcements.code = '01020';

export default Reinforcements;
