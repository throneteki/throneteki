import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class SecretsOfTheConclave extends PlotCard {
    // Secrets of the Conclave (12051)
    // Reaction: After the challenges phase begins, look at the top 5 cards of your deck. Add 1 to
    // your hand, discard 1, and put the others back on top of your deck in any order.
    setupCardAbilities() {
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'challenge'
            },
            message: '{player} uses {source} to look at the top 5 cards of their deck',
            gameAction: GameActions.lookAtDeck((context) => ({
                player: context.player,
                lookingAt: context.player,
                amount: 5
            })).then({
                targets: {
                    hand: {
                        type: 'select',
                        activePromptTitle: 'Choose a card to add to your hand',
                        revealTargets: true,
                        cardCondition: (card, context) => context.event.topCards.includes(card)
                    },
                    discard: {
                        type: 'select',
                        ifAble: true,
                        activePromptTitle: 'Choose card to discard',
                        revealTargets: true,
                        cardCondition: (card, context) =>
                            context.event.topCards.includes(card) && card !== context.targets.hand
                    }
                },
                message: {
                    format: 'Then {player} adds 1 card to their hand, discards {discard}, and places the rest on top of their deck in any order',
                    args: { discard: (context) => context.targets.discard }
                },
                gameAction: GameActions.simultaneously((context) => [
                    GameActions.addToHand({ card: context.targets.hand }),
                    GameActions.discardCard({ card: context.targets.discard }),
                    ...context.event.topCards
                        .filter(
                            (card) =>
                                ![context.targets.hand, context.targets.discard].includes(card)
                        )
                        .map((card) => GameActions.placeCard({ card, location: 'draw deck' }))
                ])
            })
        });
    }
}

SecretsOfTheConclave.code = '12051';

export default SecretsOfTheConclave;
