import PlotCard from '../../plotcard.js';
import { Tokens } from '../../Constants/index.js';

class FavorsFromTheCrown extends PlotCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                //Don't see any advantage in bestow-boosting your opponent's cards, so limiting this to own controlled cards
                onCardEntersPlay: (event) =>
                    event.card.getType() !== 'plot' &&
                    event.card.isBestow() &&
                    event.card.controller === this.controller
            },
            handler: (context) => {
                let numToAdd = context.event.card.tokens[Tokens.gold] >= 3 ? 2 : 1;
                context.event.card.modifyToken(Tokens.gold, numToAdd);
                this.game.addMessage(
                    '{0} uses {1} to place {2} gold from the treasury on {3}',
                    this.controller,
                    this,
                    numToAdd,
                    context.event.card
                );
            }
        });
    }
}

FavorsFromTheCrown.code = '06120';

export default FavorsFromTheCrown;
