import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class ArianneMartell extends DrawCard {
    // Arianne Martell (08035)
    // Insight.
    // Challenges Action: Return Arianne Martell to your hand to choose a character with a lower STR
    // than hers, and return it to its owner's hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Return character to hand',
            phase: 'challenge',
            cost: ability.costs.returnSelfToHand(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getStrength() < context.cardStateWhenInitiated.getStrength()
            },
            message: {
                format: "{player} returns {source} to their hand to return {target} to {owner}'s hand",
                args: { owner: (context) => context.target.owner }
            },
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
        });
    }
}

ArianneMartell.code = '08035';

export default ArianneMartell;
