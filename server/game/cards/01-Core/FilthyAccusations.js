const PlotCard = require('../../plotcard.js');

class FilthyAccusations extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    !card.kneeled,
                gameAction: 'kneel'
            },
            message: '{player} uses {source} to kneel {target}',
            handler: (context) => {
                context.player.kneelCard(context.target);
            }
        });
    }
}

FilthyAccusations.code = '01011';

module.exports = FilthyAccusations;
