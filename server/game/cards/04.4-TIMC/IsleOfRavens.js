import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class IsleOfRavens extends DrawCard {
    // Isle of Ravens (04078)
    // Action: Kneel Isle of Ravens to choose a card in any player's discard pile, and shuffle it
    // into its owner's deck.
    setupCardAbilities(ability) {
        this.action({
            title: "Shuffle discarded card back into owner's deck",
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) => card.location === 'discard pile'
            },
            message: {
                format: "{player} kneels {source} to shuffle {target} back into {owner}'s deck",
                args: { owner: (context) => context.target.owner }
            },
            gameAction: GameActions.shuffleIntoDeck((context) => ({ cards: [context.target] }))
        });
    }
}

IsleOfRavens.code = '04078';

export default IsleOfRavens;
