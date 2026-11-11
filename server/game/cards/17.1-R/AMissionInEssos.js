import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import TextHelper from '../../TextHelper.js';

class AMissionInEssos extends DrawCard {
    // A Mission in Essos (17115)
    // Shadow (0).
    // Action: Return a [martell] character you control to your hand. Then, search your deck for a
    // character with lower printed cost that shares a Trait with that character, and put it into
    // play. Shuffle your deck.
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
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target })).then(
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
            )
        });
    }
}

AMissionInEssos.code = '17115';

export default AMissionInEssos;
