import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class ThePointyEnd extends PlotCard {
    // The Pointy End (18020)
    // When Revealed: Choose a character. If there are 2 or more attachments attached to that
    // character, discard each attachment from it. Otherwise, discard each duplicate and each power
    // from it.
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            gameAction: GameActions.ifCondition({
                condition: (context) => context.target.attachments.length > 1,
                thenAction: {
                    message: '{player} uses {source} to discard each attachment from {target}',
                    gameAction: GameActions.simultaneously((context) =>
                        context.target.attachments.map((card) => GameActions.discardCard({ card }))
                    )
                },
                elseAction: {
                    message:
                        '{player} uses {source} to discard each duplicate and power from {target}',
                    gameAction: GameActions.simultaneously((context) => [
                        ...context.target.dupes.map((card) => GameActions.discardCard({ card })),
                        GameActions.discardPower({
                            card: context.target,
                            amount: context.target.getPower()
                        })
                    ])
                }
            })
        });
    }
}

ThePointyEnd.code = '18020';

export default ThePointyEnd;
