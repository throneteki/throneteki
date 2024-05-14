const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class OurBladesAreSharp extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: () =>
                this.controller.anyCardsInPlay(
                    (card) => card.name === 'Harrenhal' || card.name === 'The Dreadfort'
                ),
            targetController: 'current',
            effect: ability.effects.reduceSelfCost('play', 1)
        });

        this.action({
            cost: ability.costs.sacrifice((card) => !card.isFaction('stark')),
            target: {
                mode: 'upTo',
                numCards: 2,
                cardCondition: (card, context) =>
                    card.controller === context.player &&
                    card.hasTrait('House Bolton') &&
                    ['dead pile', 'discard pile'].includes(card.location)
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} plays {1} and sacrifices {2} to return {3} to hand',
                    context.player,
                    this,
                    context.costs.sacrifice,
                    context.target
                );
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        context.target.map((selection) =>
                            GameActions.returnCardToHand({ card: selection })
                        )
                    ),
                    context
                );
            }
        });
    }
}

OurBladesAreSharp.code = '20028';

module.exports = OurBladesAreSharp;
