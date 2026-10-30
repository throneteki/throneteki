import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import TextHelper from '../../TextHelper.js';

class GrowingAmbition extends DrawCard {
    // Growing Ambition (11044)
    // Shadow (X).
    // Challenges Action: Search your deck for X different cards and place them in your discard
    // pile. Shuffle your deck. Then, choose an opponent. Return X cards of that opponent's choice
    // from your discard pile to your hand.
    setupCardAbilities() {
        this.xValue({ min: () => 1, max: (context) => context.player.drawDeck.length });

        this.action({
            title: 'Search deck',
            phase: 'challenge',
            message: {
                format: '{player} plays {source} to search their deck for {amount} cards',
                args: { amount: (context) => context.xValue }
            },
            gameAction: GameActions.search({
                title: (context) => `Select ${TextHelper.count(context.xValue, 'card')}`,
                numToSelect: (context) => context.xValue,
                match: {
                    condition: (card, context) =>
                        !context.selectedCards.some((selected) => selected.name === card.name)
                },
                reveal: false,
                message: '{player} places {searchTarget} in their discard pile',
                gameAction: GameActions.simultaneously((context) =>
                    context.searchTarget.map((card) =>
                        GameActions.placeCard({
                            player: context.player,
                            card: card,
                            location: 'discard pile'
                        })
                    )
                )
            }).then({
                chooseOpponent: true,
                message: {
                    format: "Then {opponent} returns {amount} from {player}'s discard pile to their hand",
                    args: {
                        amount: (context) => TextHelper.count(context.parentContext.xValue, 'card')
                    }
                },
                gameAction: GameActions.chooseCards({
                    player: (context) => context.opponent,
                    mode: 'exactly',
                    numCards: (context) => context.parentContext.xValue,
                    title: (context) =>
                        `Select ${TextHelper.count(context.parentContext.xValue, 'card')}`,
                    cardCondition: (card, context) =>
                        card.controller === context.player && card.location === 'discard pile',
                    gameAction: (card, context) =>
                        GameActions.placeCard({ player: context.player, card, location: 'hand' })
                })
            })
        });
    }
}

GrowingAmbition.code = '11044';

export default GrowingAmbition;
