import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DoreaSand extends DrawCard {
    // Dorea Sand (08016)
    // Reaction: After Dorea Sand enters play, choose another character with printed cost X or lower
    // and return it to its owner's hand. X is the number of Sand Snake characters you control.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card !== context.source &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= context.source.getNumberOfSandSnakes()
            },
            message: {
                format: "{player} uses {source} to return {target} to {owner}'s hand",
                args: { owner: (context) => context.target.owner }
            },
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
        });
    }

    getNumberOfSandSnakes() {
        return this.controller.getNumberOfCardsInPlay(
            (card) => card.hasTrait('Sand Snake') && card.getType() === 'character'
        );
    }
}

DoreaSand.code = '08016';

export default DoreaSand;
