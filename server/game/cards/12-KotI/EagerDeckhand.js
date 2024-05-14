const DrawCard = require('../../drawcard.js');

class EagerDeckhand extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card.getType() === 'location' &&
                    event.card.controller === this.controller &&
                    event.card.hasTrait('warship')
            },
            location: 'hand',
            message: '{player} puts {source} into play from their hand',
            handler: () => {
                this.controller.putIntoPlay(this);
            }
        });
    }
}

EagerDeckhand.code = '12014';

module.exports = EagerDeckhand;
