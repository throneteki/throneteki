import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NorthernEnvoy extends DrawCard {
    // Northern Envoy (26049)
    // Reaction: After Northern Envoy enters play, reveal the top 10 cards of an opponent's deck.
    // Choose 1 non-unique character revealed this way and place it in that player's discard pile.
    // Shuffle that player's deck.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            message: {
                format: "{player} uses {source} to reveal the top 10 cards of {opponent}'s deck",
                args: { opponent: (context) => context.opponent }
            },
            chooseOpponent: true,
            gameAction: GameActions.revealTopCards((context) => ({
                player: context.opponent,
                amount: 10,
                whileRevealed: GameActions.chooseCards({
                    title: 'Select a character',
                    cardCondition: (card, context) =>
                        context.revealed.includes(card) &&
                        card.getType() === 'character' &&
                        !card.isUnique(),
                    gameAction: (card) => GameActions.placeCard({ card, location: 'discard pile' })
                })
            })).then({
                message: {
                    format: '{revealPlayer} {gameAction}',
                    args: { revealPlayer: (context) => context.parentContext.opponent }
                },
                gameAction: GameActions.shuffle((context) => ({
                    player: context.parentContext.opponent
                }))
            })
        });
    }
}

NorthernEnvoy.code = '26049';

export default NorthernEnvoy;
