import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AllaTyrell extends DrawCard {
    // Alla Tyrell (22022)
    // Interrupt: When Alla Tyrell is revealed from your hand or deck, put her into play.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardRevealed: (event) =>
                    event.card === this &&
                    ['draw deck', 'hand'].includes(event.card.location) &&
                    this.controller.canPutIntoPlay(this)
            },
            location: ['draw deck', 'hand'],
            message: '{player} uses {source} to put {source} into play',
            gameAction: GameActions.putIntoPlay(() => ({ card: this }))
        });
    }
}

AllaTyrell.code = '22022';

export default AllaTyrell;
