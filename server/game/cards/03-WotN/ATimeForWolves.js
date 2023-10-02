const GameActions = require('../../GameActions/index.js');
const PlotCard = require('../../plotcard.js');

class ATimeForWolves extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            message: '{player} uses {source} to search their deck for a Direwolf card',
            gameAction: GameActions.search({
                title: 'Select a card',
                match: { trait: 'Direwolf' },
                gameAction: GameActions.ifCondition({
                    condition: context => context.searchTarget.getPrintedCost() > 3 || !context.player.canPutIntoPlay(context.searchTarget),
                    thenAction: {
                        message: '{player} {gameAction}',
                        gameAction: GameActions.addToHand(context => ({
                            card: context.searchTarget
                        }))
                    },
                    elseAction: GameActions.choose({
                        title: 'Put card into play?',
                        message: '{player} {gameAction}',
                        choices: {
                            'Add to hand': GameActions.addToHand(context => ({ card: context.searchTarget })),
                            'Put in play': GameActions.putIntoPlay(context => ({ card: context.searchTarget }))
                        }
                    })
                })
            })
        });
    }
}

ATimeForWolves.code = '03046';

module.exports = ATimeForWolves;
