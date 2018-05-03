const DrawCard = require('../../drawcard.js');

class StarfallCavalry extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this && this.controller.canDraw()
            },
            handler: () => {
                let cards = this.controller.getNumberOfUsedPlots() >= 3 ? 3 : 1;
                cards = this.controller.drawCardsToHand(cards).length;

                this.game.addMessage('{0} uses {1} to draw {2} card{3}', this.controller, this, cards, cards > 1 ? 's' : '');
            }
        });
    }
}

StarfallCavalry.code = '04035';

module.exports = StarfallCavalry;
