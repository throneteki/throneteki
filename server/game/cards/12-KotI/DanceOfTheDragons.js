import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DanceOfTheDragons extends DrawCard {
    // "Dance of the Dragons" (12036)
    // Action: Choose a non-event card with printed cost 3 or lower in your discard pile and return
    // it to your hand.
    setupCardAbilities() {
        this.action({
            title: 'Return card to hand',
            target: {
                cardCondition: (card, context) =>
                    card.controller === context.source.controller &&
                    card.location === 'discard pile' &&
                    card.getType() !== 'event' &&
                    card.getPrintedCost() <= 3
            },
            message: '{player} plays {source} to return {target} to their hand',
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
        });
    }
}

DanceOfTheDragons.code = '12036';

export default DanceOfTheDragons;
