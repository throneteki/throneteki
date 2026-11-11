import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RaffTheSweetling extends DrawCard {
    // Raff the Sweetling (08049)
    // Pillage.
    // Reaction: After Raff the Sweetling discards a character using pillage, choose a character
    // with printed cost 2 or lower and return it to its owner’s hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.isPillage &&
                    event.source === context.source &&
                    event.card.getType() === 'character'
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 2,
                gameAction: 'returnToHand'
            },
            message: {
                format: "{player} uses {source} to return {target} to {owner}'s hand",
                args: { owner: (context) => context.target.owner }
            },
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
        });
    }
}

RaffTheSweetling.code = '08049';

export default RaffTheSweetling;
