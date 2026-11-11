import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ARoseOfGold extends DrawCard {
    // "A Rose of Gold" (05038)
    // Challenges Action: Look at the top 3 cards of your deck. Add 1 to your hand, and place the
    // others on the bottom of your deck in any order.
    setupCardAbilities() {
        this.action({
            title: 'Look at top 3 cards of deck',
            phase: 'challenge',
            message: '{player} uses {source} to look at the top 3 cards of their deck',
            gameAction: GameActions.lookAtDeck((context) => ({
                player: context.player,
                lookingAt: context.player,
                amount: 3
            })).then({
                target: {
                    type: 'select',
                    activePromptTitle: 'Choose a card to add to your hand',
                    revealTargets: true,
                    cardCondition: (card, context) => context.event.topCards.includes(card)
                },
                message:
                    'Then {player} adds a card to their hand and places the others on the bottom of their deck',
                gameAction: GameActions.simultaneously((context) => [
                    GameActions.addToHand({ card: context.target }),
                    ...context.event.topCards
                        .filter((card) => card !== context.target)
                        .map((card) =>
                            GameActions.placeCard({ card, location: 'draw deck', bottom: true })
                        )
                ])
            })
        });
    }
}

ARoseOfGold.code = '05038';

export default ARoseOfGold;
