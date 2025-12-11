import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

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
                        this.game.resolveGameAction(
                            GameActions.simultaneously(
                                cards.map((card) => GameActions.discardCard({ card, context }))
                            ).then({
                                message: {
                                    format: '{player} discards {cards} to reduce the cost of the next card they marshal, ambush or bring out of shadows this phase by {amount}',
                                    args: {
                                        cards: () => cards,
                                        amount: () => this.getAmount(cards)
                                    }
                                },
                                handler: () => {
                                    this.untilEndOfPhase((ability) => ({
                                        targetController: 'current',
                                        effect: ability.effects.reduceNextMarshalledAmbushedOrOutOfShadowsCardCost(
                                            this.getAmount(cards)
                                        )
                                    }));
                                }
                            }),
                            context
                        );
                        return true;
                    }
                });
            }
        });
    }

    getAmount(cards) {
        return cards.length * 2;
    }
}

QueenOfMeereen.code = '26034';

export default QueenOfMeereen;
