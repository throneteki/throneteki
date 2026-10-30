import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class KingsLandingSmuggler extends DrawCard {
    // King's Landing Smuggler (19018)
    // Interrupt: When King's Landing Smuggler leaves play, place 1 gold from the treasury on a card
    // without gold.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardLeftPlay: (event, context) => event.card === context.source
            },
            target: {
                activePromptTitle: 'Select a card without gold',
                cardCondition: (card) =>
                    card.location === 'play area' && !card.hasToken(Tokens.gold)
            },
            message: '{player} uses {source} to place a gold from the treasury on {target}',
            gameAction: GameActions.placeToken((context) => ({
                card: context.target,
                token: Tokens.gold
            }))
        });
    }
}

KingsLandingSmuggler.code = '19018';

export default KingsLandingSmuggler;
