const PlotCard = require('../../plotcard.js');

class FilthyAccusations extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && !card.kneeled,
                gameAction: 'kneel'
            },
            handler: context => {
                this.controller.kneelCard(context.target);

                this.game.addMessage('{0} uses {1} to kneel {2}', this.controller, this, context.target);
            }
        });
    }
}

FilthyAccusations.code = '01011';

module.exports = FilthyAccusations;
