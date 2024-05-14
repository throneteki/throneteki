const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class LayWaste extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard location or attachment',
            phase: 'dominance',
            target: {
                activePromptTitle: 'Select a non-limited location or attachment',
                cardCondition: (card) =>
                    card.isMatch({
                        location: 'play area',
                        type: ['attachment', 'location'],
                        limited: false
                    }),
                gameAction: 'discard'
            },
            message: '{player} plays {source} to discard {target} from play',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.discardCard((context) => ({
                        card: context.target
                    })).then({
                        message: {
                            format: 'Then, {targetOwner} searches their deck for an attachment or location with a lower printed cost',
                            args: { targetOwner: (context) => context.parentContext.target.owner }
                        },
                        gameAction: GameActions.search({
                            player: (context) => context.parentContext.target.owner,
                            title: 'Select a card',
                            match: {
                                type: ['attachment', 'location'],
                                printedCostOrLower: context.target.getPrintedCost() - 1
                            },
                            reveal: false,
                            message: {
                                format: '{targetOwner} {gameAction}',
                                args: {
                                    targetOwner: (context) => context.parentContext.target.owner
                                }
                            },
                            gameAction: GameActions.putIntoPlay((context) => ({
                                player: context.parentContext.target.owner,
                                card: context.searchTarget
                            }))
                        })
                    }),
                    context
                );
            }
        });
    }
}

LayWaste.code = '15044';

module.exports = LayWaste;
