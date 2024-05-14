const DrawCard = require('../../drawcard.js');
const TextHelper = require('../../TextHelper');

class FeverDreams extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'opponent' });
        this.reaction({
            when: {
                onCardKneeled: (event) => event.card === this.parent && this.controller.canDraw()
            },
            cost: ability.costs.discardGold(),
            handler: () => {
                let cards = this.controller.drawCardsToHand(2).length;
                this.game.addMessage(
                    '{0} discards a gold from {1} to draw {2}',
                    this.controller,
                    this,
                    TextHelper.count(cards, 'card')
                );
            }
        });
    }
}

FeverDreams.code = '06050';

module.exports = FeverDreams;
