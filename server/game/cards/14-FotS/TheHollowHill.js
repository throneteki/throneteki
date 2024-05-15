import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheHollowHill extends DrawCard {
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
