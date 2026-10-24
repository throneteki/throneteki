import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class QueenOfMeereen extends DrawCard {
    // Queen of Meereen (26034)
    // Lady character only.
    // Attached character gains the Queen trait.
    // Action: Kneel Queen of Meereen to discard 1 or more cards from your hand. Reduce the cost of
    // the next card you marshal, ambush, or bring out of shadows this phase by 2 for each card
    // discarded this way.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: ['Lady'] });
        this.whileAttached({
            effect: ability.effects.addTrait('Queen')
        });
        this.action({
            title: 'Discard to reduce',
            cost: ability.costs.kneelSelf(),
            condition: (context) => context.player.hand.length > 0,
            target: {
                type: 'select',
                mode: 'unlimited',
                cardCondition: (card, context) =>
                    card.location === 'hand' && card.controller === context.player
            },
            message: '{player} kneels {source} to discard {target}',
            gameAction: GameActions.simultaneously((context) =>
                context.target.map((card) => GameActions.discardCard({ card }))
            ).then((context) => ({
                gameAction: GameActions.lastingEffect(() => ({
                    duration: 'untilEndOfPhase',
                    targetController: 'current',
                    effect: ability.effects.reduceNextMarshalledAmbushedOrOutOfShadowsCardCost(
                        context.target.length * 2
                    )
                }))
            }))
        });
    }
}

QueenOfMeereen.code = '26034';

export default QueenOfMeereen;
