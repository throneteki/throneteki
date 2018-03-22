const DrawCard = require('../../drawcard.js');

class OldtownScholar extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardsDrawn: event => event.player !== this.controller && this.controller.canDraw()
            },
            cost: ability.costs.kneelSelf(),
            handler: context => {
                let numToDraw = context.event.cards.length;
                let drawn = context.player.drawCardsToHand(numToDraw);
                this.game.addMessage('{0} kneels {1} to draw {2} card{3}',
                    context.player, this, drawn.length, drawn.length > 1 ? 's' : '');

            }
        });
    }
}

OldtownScholar.code = '10041';

module.exports = OldtownScholar;
