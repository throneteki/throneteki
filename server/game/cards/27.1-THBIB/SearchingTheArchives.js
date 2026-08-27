import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class SearchingTheArchives extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                numCards: 3,
                activePromptTitle: 'Select up to 3 cards',
                cardCondition: (card, context) =>
                    context.player === card.controller && card.location === 'hand'
            },
            message: {
                format: '{player} uses {source} to place {amount} cards facedown under their agenda',
                args: { amount: (context) => context.target.length }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        context.target.map((card) =>
                            GameActions.placeCardUnderneath({
                                card,
                                parentCard: context.player.agenda
                            })
                        )
                    ).then({
                        message: {
                            format: 'Then, {player} draws {amount} cards',
                            args: { amount: (context) => context.parentContext.target.length }
                        },
                        gameAction: GameActions.drawCards((context) => ({
                            player: context.player,
                            amount: context.parentContext.target.length
                        }))
                    }),
                    context
                );
            }
        });
    }
}

SearchingTheArchives.code = '27020';

export default SearchingTheArchives;
