import PlotCard from '../../plotcard.js';

class Reinforcements extends PlotCard {
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
