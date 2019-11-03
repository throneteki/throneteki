const DrawCard = require('../../drawcard.js');

class SerMerynTrant extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardDiscarded: event => event.originalLocation === 'hand' && event.card.controller !== this.controller
            },
            handler: context => {
                let card = context.event.card;
                let player = card.controller;
                player.moveCard(card, 'out of game');
                this.game.addMessage('{0} uses {1} to remove {2} from the game', this.controller, this, card);
            }
        });
    }
}

SerMerynTrant.code = '15029';

module.exports = SerMerynTrant;
