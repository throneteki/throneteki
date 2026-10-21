import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheHollowHill extends DrawCard {
    // The Hollow Hill (14042)
    // Dominance Action: If you control no loyal characters, kneel The Hollow Hill to search the top
    // 10 cards of your deck for a non-loyal character, reveal it, and add it to your hand. Shuffle
    // your deck.
    setupCardAbilities(ability) {
        this.action({
            title: 'Search your deck',
            phase: 'dominance',
            condition: () =>
                !this.controller.anyCardsInPlay(
                    (card) => card.getType() === 'character' && card.isLoyal()
                ),
            cost: ability.costs.kneelSelf(),
            message:
                '{player} kneels {costs.kneel} to search the top 10 cards of their deck for a non-loyal character',
            gameAction: GameActions.search({
                title: 'Select a character',
                topCards: 10,
                match: { type: 'character', loyal: false },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

TheHollowHill.code = '14042';

export default TheHollowHill;
