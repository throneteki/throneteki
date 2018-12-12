const DrawCard = require('../../drawcard.js');

class EagerDeckhand extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card.getType() === 'location' && event.card.controller === this.controller && event.card.hasTrait('warship')
            },
            location: 'hand',
            handler: () => {
                this.controller.putIntoPlay(this);

                this.game.addMessage('{0} puts {1} into play from their hand', this.controller, this);
            }
        });
    }
}

EagerDeckhand.code = '12014';

module.exports = EagerDeckhand;
