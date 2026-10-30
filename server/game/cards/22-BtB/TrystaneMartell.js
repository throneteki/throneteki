import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TrystaneMartell extends DrawCard {
    // Trystane Martell (22010)
    // Shadow (2).
    // Reaction: After Trystane Martell enters play, choose a character with no challenge icons and
    // return it to its owner's hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getNumberOfIcons() === 0
            },
            message: {
                format: "{player} uses {source} to return {target} to {controller}'s hand",
                args: { controller: (context) => context.target.controller }
            },
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
        });
    }
}

TrystaneMartell.code = '22010';

export default TrystaneMartell;
