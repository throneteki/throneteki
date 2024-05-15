import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class KingsLandingSmuggler extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardLeftPlay: (event) => event.card === this
            },
            target: {
                activePromptTitle: 'Select a card without gold',
                cardCondition: (card) =>
                    card.location === 'play area' && !card.hasToken(Tokens.gold)
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to place a gold from the treasury on {2}',
                    context.player,
                    this,
                    context.target
                );
                this.game.resolveGameAction(
                    GameActions.placeToken(() => ({ card: context.target, token: Tokens.gold })),
                    context
                );
            }
        });
    }
}

KingsLandingSmuggler.code = '19018';

export default KingsLandingSmuggler;
