  
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

AMissionInEssos.cardData = {
    "text": "Shadow (0).\n<b>Action</b>: Return a [martell] character you control to your hand. Then, search your deck for a character that shares a <i>Trait</i> with that character and with lower printed cost and put it in play. Shuffle your deck."
};

module.exports = AMissionInEssos;
