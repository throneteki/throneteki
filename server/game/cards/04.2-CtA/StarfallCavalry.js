const DrawCard = require('../../drawcard.js');
const TextHelper = require('../../TextHelper');

class StarfallCavalry extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && this.controller.canDraw()
            },
            handler: () => {
                let cards = this.controller.getNumberOfUsedPlots() >= 3 ? 3 : 1;
                cards = this.controller.drawCardsToHand(cards).length;

                this.game.addMessage(
                    '{0} uses {1} to draw {2}',
                    this.controller,
                    this,
                    TextHelper.count(cards, 'card')
                );
            }
        });
    }
}

StarfallCavalry.code = '04035';

module.exports = StarfallCavalry;
