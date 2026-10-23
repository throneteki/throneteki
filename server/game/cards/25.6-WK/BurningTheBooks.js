import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class BurningTheBooks extends PlotCard {
    // Burning the Books (25119)
    // When Revealed: Each opponent chooses a non-The Seven attachment they control, if able, and
    // discards it from play. Then, you may discard 1 power from a character you control to initiate
    // this effect again.
    setupCardAbilities(ability) {
        this.whenRevealed({
            target: {
                choosingPlayer: 'eachOpponent',
                ifAble: true,
                cardCondition: {
                    type: 'attachment',
                    not: { trait: 'The Seven' },
                    location: 'play area',
                    controller: 'choosingPlayer'
                }
            },
            message: '{player} uses {source} to discard {target}',
            gameAction: GameActions.simultaneously((context) =>
                context.targets
                    .getTargets()
                    .map((card) => GameActions.discardCard({ card, source: context.source }))
            ).then({
                condition: (context) =>
                    context.game
                        .getOpponents(context.player)
                        .some((opponent) =>
                            opponent.anyCardsInPlay((card) => card.getType() === 'attachment')
                        ),
                cost: ability.costs.discardPower(1, (card) => card.getType() === 'character'),
                message:
                    'Then, {player} discards 1 power from {costs.discardPower} to initiate this effect again',
                gameAction: GameActions.initiateWhenRevealed((context) => ({
                    plot: context.source,
                    player: context.player
                }))
            })
        });
    }
}

BurningTheBooks.code = '25119';

export default BurningTheBooks;
