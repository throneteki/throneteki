
const PlotCard = require('../../plotcard.js');

class FallenFromFavor extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                cardCondition: card =>
                    card.location === 'play area'
                    && card.controller === this.controller
                    && card.getType() === 'character'
            },
            handler: context => {
                let card = context.target;
                context.player.sacrificeCard(card);
                this.game.addMessage('{0} sacrifices {1} for {2}', context.player, card, this);
            }
        });
    }
}

FallenFromFavor.code = '03047';

module.exports = FallenFromFavor;
