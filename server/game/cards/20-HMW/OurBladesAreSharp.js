import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OurBladesAreSharp extends DrawCard {
    // Our Blades are Sharp (20028)
    // While you control Harrenhal or The Dreadfort, reduce the cost to play Our Blades Are Sharp by
    // 1.
    // Action: Sacrifice a non-[stark] card to return up to 2 House Bolton cards from your discard
    // and/or dead pile to your hand.
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

export default OurBladesAreSharp;
