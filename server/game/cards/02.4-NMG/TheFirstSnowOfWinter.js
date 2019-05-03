const PlotCard = require('../../plotcard.js');

class TheFirstSnowOfWinter extends PlotCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onPhaseStarted: event => event.phase === 'challenge'
            },
            handler: () => {
                for(let player of this.game.getPlayers()) {
                    this.returnCardsToHand(player);
                }

                this.game.addMessage('{0} uses {1} to force both players to return each card with printed cost 3 or lower to their hand', this.controller, this);
            }
        });
    }

    returnCardsToHand(player) {
        let characters = player.filterCardsInPlay(card => card.getType() === 'character' && card.hasPrintedCost() && card.getPrintedCost() <= 3);
        for(let card of characters) {
            player.returnCardToHand(card);
        }
    }
}

TheFirstSnowOfWinter.code = '02079';

module.exports = TheFirstSnowOfWinter;
