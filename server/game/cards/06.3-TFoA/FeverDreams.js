const DrawCard = require('../../drawcard.js');

class FeverDreams extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'opponent' });
        this.reaction({
            when: {
                onCardKneeled: event => event.card === this.parent && this.controller.carDraw()
            },
            cost: ability.costs.discardGold(),
            handler: () => {
                let cards = this.controller.drawCardsToHand(2).length;
                this.game.addMessage('{0} discards a gold from {1} to draw {2} {3}',
                    this.controller, this, cards, cards > 1 ? 'cards' : 'card');
            }
        });
    }
}

FeverDreams.code = '06050';

module.exports = FeverDreams;
