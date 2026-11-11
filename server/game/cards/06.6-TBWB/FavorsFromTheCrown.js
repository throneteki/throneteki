import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class FavorsFromTheCrown extends PlotCard {
    // Favors From the Crown (06120)
    // Reaction: After a card with bestow enters play, place 1 gold from the treasury on that card.
    // (2 gold instead if that card has 3 or more gold on it.)
    setupCardAbilities() {
        this.reaction({
            when: {
                //Don't see any advantage in bestow-boosting your opponent's cards, so limiting this to own controlled cards
                onCardEntersPlay: (event, context) =>
                    event.card.getType() !== 'plot' &&
                    event.card.isBestow() &&
                    event.card.controller === context.source.controller
            },
            message: {
                format: '{player} uses {source} to place {amount} gold from the treasury on {card}',
                args: {
                    amount: (context) => (context.event.card.tokens[Tokens.gold] >= 3 ? 2 : 1),
                    card: (context) => context.event.card
                }
            },
            gameAction: GameActions.placeToken((context) => ({
                card: context.event.card,
                token: Tokens.gold,
                amount: context.event.card.tokens[Tokens.gold] >= 3 ? 2 : 1
            }))
        });
    }
}

FavorsFromTheCrown.code = '06120';

export default FavorsFromTheCrown;
