import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AllaTyrell extends DrawCard {
    // Alla Tyrell (22022)
    // Interrupt: When Alla Tyrell is revealed from your hand or deck, put her into play.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardRevealed: (event, context) =>
                    event.card === context.source &&
                    ['draw deck', 'hand'].includes(event.card.location) &&
                    context.player.canPutIntoPlay(context.source)
            },
            location: ['draw deck', 'hand'],
            message: '{player} uses {source} to put {source} into play',
            gameAction: GameActions.putIntoPlay((context) => ({ card: context.source }))
        });
    }
}

AllaTyrell.code = '22022';

export default AllaTyrell;
