import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class JojenReed extends DrawCard {
    // Jojen Reed (04061)
    // Stealth.
    // Reaction: After Jojen Reed stands, reveal the top card of each player's deck. You may either:
    // discard each of those cards, or have each player draw 1 card.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardStood: (event, context) => event.card === context.source
            },
            message: "{player} uses {source} to reveal the top cards of each player's deck",
            gameAction: GameActions.revealCards((context) => ({
                cards: context.game.getPlayers().map((player) => player.drawDeck[0]),
                player: context.player,
                whileRevealed: GameActions.choose({
                    choices: {
                        'Discard revealed cards': {
                            message: '{player} chooses to have the revealed cards discarded',
                            gameAction: GameActions.simultaneously((context) =>
                                context.revealed.map((card) =>
                                    GameActions.discardCard({ card, source: context.source })
                                )
                            )
                        },
                        'Each player draw 1 card': {
                            message: '{player} chooses to have each player draw 1 card',
                            gameAction: GameActions.simultaneously(
                                context.game.getPlayers().map((player) =>
                                    GameActions.drawCards({
                                        player: player,
                                        amount: 1,
                                        source: context.source
                                    })
                                )
                            )
                        }
                    }
                })
            }))
        });
    }
}

JojenReed.code = '04061';

export default JojenReed;
