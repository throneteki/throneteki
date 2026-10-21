import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class MaesterHarmune extends DrawCard {
    // Maester Harmune (25089)
    // Reaction: After gold is moved from an opponent's gold pool to your own, reveal the top card
    // of that player's deck. If that card is a character, discard it and draw 1 card. (Limit twice
    // per round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onGoldTransferred: (event) =>
                    event.source.getGameElementType() === 'player' &&
                    event.source !== this.controller &&
                    event.target === this.controller
            },
            limit: ability.limit.perRound(2),
            message: {
                format: "{player} uses {source} to reveal the top card of {opponent}'s deck",
                args: { opponent: (context) => context.event.source }
            },
            gameAction: GameActions.revealTopCards((context) => ({
                player: context.event.source
            })).then({
                message: '{player} {gameAction}',
                gameAction: GameActions.ifCondition({
                    condition: (context) => context.event.cards[0].getType() === 'character',
                    thenAction: GameActions.simultaneously([
                        GameActions.discardCard((context) => ({
                            card: context.parentContext.revealed[0]
                        })),
                        GameActions.drawCards((context) => ({
                            player: context.player,
                            amount: 1,
                            source: this
                        }))
                    ])
                })
            })
        });
    }
}

MaesterHarmune.code = '25089';

export default MaesterHarmune;
