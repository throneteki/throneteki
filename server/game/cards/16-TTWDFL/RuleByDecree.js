import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';
import Message from '../../Message.js';

function cardsNotKept(player, keptCards) {
    return player.hand.filter((card) => !(keptCards || []).includes(card));
}

function getHighestHandSize(game) {
    return Math.max(...game.getPlayers().map((player) => player.hand.length));
}

class RuleByDegree extends PlotCard {
    // Rule By Decree (16033)
    // When Revealed: Each player with the most cards in hand chooses and discards cards from his or
    // her hand until he or she has 4 cards in hand.
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                choosingPlayer: (player, context) =>
                    player.hand.length > 4 &&
                    player.getHandCount() === getHighestHandSize(context.game),
                activePromptTitle: 'Select 4 cards to keep',
                mode: 'exactly',
                numCards: 4,
                cardCondition: { location: 'hand', controller: 'choosingPlayer' },
                gameAction: GameActions.simultaneously((context) =>
                    cardsNotKept(context.choosingPlayer, context.target).map((card) =>
                        GameActions.discardCard({ card })
                    )
                )
            },
            message: {
                format: '{player} uses {source} to have {fragments}',
                args: {
                    fragments: (context) =>
                        context.targets.selections.map((selection) =>
                            Message.fragment('{player} discard {cards}', {
                                player: selection.choosingPlayer,
                                cards: cardsNotKept(selection.choosingPlayer, selection.value)
                            })
                        )
                }
            }
        });
    }
}

RuleByDegree.code = '16033';

export default RuleByDegree;
