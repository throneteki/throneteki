const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class LayWaste extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard location or attachment',
            phase: 'dominance',
            target: {
                activePromptTitle: 'Select a non-limited location or attachment',
                cardCondition: card => card.location === 'play area' && 
                                       (
                                           (card.getType() === 'location' && !card.isLimited()) ||
                                           card.getType() === 'attachment'
                                       ),
                gameAction: 'discard'
            },
            message: '{player} uses {source} to discard {target} from play',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.discardCard(context => ({
                        card: context.target
                    })).then({
                        handler: () => {
                            this.game.resolveGameAction(
                                GameActions.search({
                                    player: context.target.owner,
                                    title: 'Select a location or attachment',
                                    match: { type: 'location', printedCostOrLower: context.target.getPrintedCost() },
                                    message: 'Then {player} uses {source} to search their deck and put {searchTarget} into play',
                                    cancelMessage: '{player} uses {source} to search their deck but does not find a card',
                                    gameAction: GameActions.putIntoPlay(thenContext => ({
                                        player: thenContext.player,
                                        card: thenContext.searchTarget
                                    }))
                                }),
                                context
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
