import PlotCard from '../../plotcard.js';

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
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to put {2} into play from their {3}',
                    context.player,
                    this,
                    context.target,
                    context.target.location
                );
                context.player.putIntoPlay(context.target);
            }
        });
    }
}

Reinforcements.code = '01020';

export default Reinforcements;
