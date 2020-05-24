const PlotCard = require('../../plotcard');
const GameActions = require('../../GameActions');
const Message = require('../../Message');

class CityOfSecrets extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            message: '{player} uses {source} to have each player draw 2 cards',
            gameAction: GameActions.simultaneously(context => context.game.getPlayers().map(player => (
                GameActions.drawCards({ player, amount: 2 })
            ))).then({
                target: {
                    choosingPlayer: player => !this.hasUsedCityPlot(player),
                    mode: 'exactly',
                    numCards: 2,
                    activePromptTitle: 'Select 2 cards',
                    cardCondition: { location: 'hand', controller: 'choosingPlayer' }
                },
                message: {
                    format: 'Then {fragments} for {source}',
                    args: {
                        fragments: context => context.targets.selections.map(selection =>
                            Message.fragment('{player} discards {cards} from their hand', { player: selection.choosingPlayer, cards: selection.value })
                        )
                    }
                },
                handler: context => {
                    context.game.resolveGameAction(
                        GameActions.simultaneously(context => context.targets.getTargets().map(card =>
                            GameActions.discardCard({ card })
                        )),
                        context
                    );
                }
            })
        });
    }

    hasUsedCityPlot(player) {
        return player.plotDiscard.some(plot => plot.hasTrait('City'));
    }
}

CityOfSecrets.code = '13019';

module.exports = CityOfSecrets;
