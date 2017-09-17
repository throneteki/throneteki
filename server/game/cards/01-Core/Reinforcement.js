const PlotCard = require('../../plotcard.js');

class Reinforcements extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                cardCondition: card => (
                    this.controller === card.controller &&
                    card.getCost() <= 5 &&
                    card.getType() === 'character' &&
                    ['hand', 'discard pile'].includes(card.location) &&
                    this.controller.canPutIntoPlay(card)
                )
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to put {2} into play from their {3}', this.controller, this, context.target, context.target.location);
                this.controller.putIntoPlay(context.target);
            }
        });
    }
}

Reinforcements.code = '01020';

module.exports = Reinforcements;
