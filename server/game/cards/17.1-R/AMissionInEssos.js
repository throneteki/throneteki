  
const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class AMissionInEssos extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Return character then search for character',
            target: {
                type: 'select',
                cardCondition: { location: 'play area', faction: 'martell', type: 'character', controller: 'current' }
            },
            message: '{player} plays {source} to return {target} to hand',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.returnCardToHand(context => ({ card: context.target }))
                        .then(preThenContext => ({
                            gameAction: GameActions.search({
                                title: 'Select a character',
                                match: {
                                    type: 'character',
                                    trait: preThenContext.target.getTraits(),
                                    printedCostOrLower: preThenContext.target.getPrintedCost() - 1
                                },
                                message: 'Then {player} uses {source} to search their deck and put {searchTarget} into play',
                                cancelMessage: 'Then {player} uses {source} to search their deck but does not find a card',
                                gameAction: GameActions.putIntoPlay(context => ({
                                    player: context.player,
                                    card: context.searchTarget
                                }))
                            })
                        })),
                    context
                );
            }
        });
    }
}

AMissionInEssos.code = '17115';

module.exports = AMissionInEssos;
