import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GreenbloodTrader extends DrawCard {
    // Greenblood Trader (01112)
    // Reaction: After Greenblood Trader enters play, look at the top 2 cards of your deck. Add up
    // to 1 of those cards to your hand, and place the others on the bottom of your deck in any
    // order.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            message: '{player} uses {source} to look at the top 2 cards of their deck',
            gameAction: GameActions.lookAtDeck((context) => ({
                player: context.player,
                lookingAt: context.player,
                amount: 2
            })).then({
                target: {
                    type: 'select',
                    optional: true,
                    activePromptTitle: 'Add a card to hand?',
                    revealTargets: true,
                    cardCondition: (card, context) => context.event.topCards.includes(card)
                },
                message:
                    'Then {player} adds up to 1 card to their hand and places the others on the bottom of their deck',
                gameAction: GameActions.simultaneously((context) => [
                    ...(context.target ? [GameActions.addToHand({ card: context.target })] : []),
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

GreenbloodTrader.code = '01112';

export default GreenbloodTrader;
