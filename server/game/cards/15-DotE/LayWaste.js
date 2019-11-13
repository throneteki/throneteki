const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class LayWaste extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard location or attachment',
            phase: 'dominance',
            target: {
                activePromptTitle: 'Select a non-limited location or attachment',
                cardCondition: card => card.isMatch({
                    location: 'play area',
                    type: ['attachment', 'location'],
                    limited: false
                }),
                gameAction: 'discard'
            },
            message: '{player} plays {source} to discard {target} from play',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.discardCard(context => ({
                        card: context.target
                    })).then({
                        handler: thenContext => {
                            this.game.resolveGameAction(
                                GameActions.search({
                                    player: thenContext => thenContext.parentContext.target.owner,
                                    title: 'Select a card',
                                    match: {
                                        type: ['attachment', 'location'],
                                        printedCostOrLower: context.target.getPrintedCost() - 1
                                    },
                                    message: {
                                        format: 'Then {targetOwner} uses {source} to search their deck and put {searchTarget} into play',
                                        args: { targetOwner: thenContext => thenContext.parentContext.target.owner }
                                    },
                                    cancelMessage: {
                                        format: 'Then {targetOwner} uses {source} to search their deck but does not find a card',
                                        args: { targetOwner: thenContext => thenContext.parentContext.target.owner }
                                    },
                                    gameAction: GameActions.putIntoPlay(thenContext => ({
                                        player: thenContext.parentContext.target.owner,
                                        card: thenContext.searchTarget
                                    }))
                                }),
                                thenContext
                            );
                        }
                    }),
                    context
                );
            }
        });
    }
}

LayWaste.code = '15044';

module.exports = LayWaste;
