import DrawCard from '../../drawcard.js';

class EagerDeckhand extends DrawCard {
    // Eager Deckhand (12014)
    // Reaction: After a Warship location enters play under your control, put Eager Deckhand into
    // play from your hand.
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

export default EagerDeckhand;
