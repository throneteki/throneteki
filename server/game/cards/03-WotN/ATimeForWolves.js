import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class ATimeForWolves extends PlotCard {
    // A Time For Wolves (03046)
    // When Revealed: Search your deck for a Direwolf card, reveal it, and add it to your hand. If
    // that card's printed cost is 3 or lower, you may put it into play instead. Shuffle your deck.
    setupCardAbilities() {
        this.whenRevealed({
            message: '{player} uses {source} to search their deck for a Direwolf card',
            gameAction: GameActions.search({
                title: 'Select a card',
                match: { trait: 'Direwolf' },
                gameAction: GameActions.ifCondition({
                    condition: (context) =>
                        context.searchTarget.getPrintedCost() > 3 ||
                        !context.player.canPutIntoPlay(context.searchTarget),
                    thenAction: {
                        message: '{player} {gameAction}',
                        gameAction: GameActions.addToHand((context) => ({
                            card: context.searchTarget
                        }))
                    },
                    elseAction: GameActions.choose({
                        title: 'Put card into play?',
                        message: '{player} {gameAction}',
                        choices: {
                            'Add to hand': GameActions.addToHand((context) => ({
                                card: context.searchTarget
                            })),
                            'Put in play': GameActions.putIntoPlay((context) => ({
                                card: context.searchTarget
                            }))
                        }
                    })
                })
            })
        });
    }
}

ATimeForWolves.code = '03046';

export default ATimeForWolves;
