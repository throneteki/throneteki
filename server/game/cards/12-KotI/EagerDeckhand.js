import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class EagerDeckhand extends DrawCard {
    // Eager Deckhand (12014)
    // Reaction: After a Warship location enters play under your control, put Eager Deckhand into
    // play from your hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.getType() === 'location' &&
                    event.card.controller === context.source.controller &&
                    event.card.hasTrait('warship')
            },
            location: 'hand',
            message: '{player} puts {source} into play from their hand',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.source
            }))
        });
    }
}

EagerDeckhand.code = '12014';

export default EagerDeckhand;
