const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');
const TextHelper = require('../../TextHelper');

class AMissionInEssos extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Return character then search for character',
            target: {
                type: 'select',
                cardCondition: {
                    location: 'play area',
                    faction: 'martell',
                    type: 'character',
                    controller: 'current'
                }
            },
            message: '{player} plays {source} to return {target} to hand',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.returnCardToHand((context) => ({ card: context.target })).then(
                        (preThenContext, preThenEvent) => ({
                            condition: () =>
                                preThenEvent.cardStateWhenReturned.hasPrintedCost() &&
                                preThenEvent.cardStateWhenReturned.getPrintedCost() >= 0,
                            message: {
                                format: 'Then, {player} searches their deck for a {traits} character with printed cost {printedCost} or lower',
                                args: {
                                    traits: () =>
                                        TextHelper.formatList(
                                            preThenEvent.cardStateWhenReturned
                                                .getTraits()
                                                .map((trait) => TextHelper.capitalizeFirst(trait)),
                                            'or'
                                        ),
                                    printedCost: () =>
                                        preThenEvent.cardStateWhenReturned.getPrintedCost() - 1
                                }
                            },
                            gameAction: GameActions.search({
                                title: 'Select a character',
                                match: {
                                    type: 'character',
                                    printedCostOrLower:
                                        preThenEvent.cardStateWhenReturned.getPrintedCost() - 1,
                                    condition: (card) =>
                                        card
                                            .getTraits()
                                            .some((trait) =>
                                                preThenEvent.cardStateWhenReturned.hasTrait(trait)
                                            )
                                },
                                reveal: false,
                                message: '{player} {gameAction}',
                                gameAction: GameActions.putIntoPlay((context) => ({
                                    player: context.player,
                                    card: context.searchTarget
                                }))
                            })
                        })
                    ),
                    context
                );
            }
        });
    }
}

AMissionInEssos.code = '17115';

module.exports = AMissionInEssos;
