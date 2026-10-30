import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NowMyWatchBegins extends DrawCard {
    // Now My Watch Begins (07023)
    // Reaction: After a character with printed cost 5 or lower is placed in an opponent's discard
    // pile, put that character into play under your control.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardPlaced: (event, context) =>
                    event.card.location === 'discard pile' &&
                    event.player !== context.source.controller &&
                    event.card.getType() === 'character' &&
                    event.card.getPrintedCost() <= 5 &&
                    context.source.controller.canPutIntoPlay(event.card)
            },
            message: {
                format: '{player} uses {source} to put {card} into play under their control',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.event.card
            }))
        });
    }
}

NowMyWatchBegins.code = '07023';

export default NowMyWatchBegins;
