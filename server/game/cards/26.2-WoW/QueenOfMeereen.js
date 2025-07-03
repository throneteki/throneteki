import DrawCard from '../../drawcard.js';

class QueenOfMeereen extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: ['Lady'] });
        this.whileAttached({
            effect: ability.effects.addKeyword('Queen')
        });
        this.action({
            title: 'Discard to reduce',
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {costs.kneel} to discard 1 or more cards from their hand',
            condition: (context) => context.player.hand.length > 0,
            handler: (context) => {
                this.game.promptForSelect(context.player, {
                    type: 'select',
                    mode: 'unlimited',
                    activePromptTitle: 'Select cards',
                    source: context.source,
                    context: context,
                    cardCondition: (card, context) =>
                        card.isMatch({ location: 'hand' }) && card.controller === context.player,
                    onSelect: (player, cards) => {
                        const reduction = cards.length * 2;
                        this.untilEndOfPhase((ability) => ({
                            targetController: 'current',
                            effect: ability.effects.reduceNextMarshalledAmbushedOrOutOfShadowsCardCost(
                                reduction
                            )
                        }));
                        this.game.addMessage(
                            '{0} discards {1} to reduce the cost of the next card they marshal, ambush or bring out of shadows this phase by {2}',
                            player,
                            cards,
                            reduction
                        );
                        return true;
                    }
                });
            }
        });
    }
}

QueenOfMeereen.code = '26034';

export default QueenOfMeereen;
