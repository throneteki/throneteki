const DrawCard = require('../../drawcard.js');

class FeverDreams extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'opponent' });
        this.reaction({
            when: {
                onCardKneeled: event => event.card === this.parent
            },
            cost: ability.costs.discardGold(),
            handler: () => {
                this.controller.drawCardsToHand(2);
                this.game.addMessage('{0} discards a gold from {1} to draw 2 cards', this.controller, this);
            }
        });
    }
}

FeverDreams.code = '06050';

module.exports = FeverDreams;
