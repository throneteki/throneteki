import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class MargaeryTyrell extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCardRevealed: {
                    aggregateBy: (event) => ({
                        controller: event.card.controller,
                        isTyrell: event.card.isFaction('tyrell'),
                        isInHandOrDeck: ['hand', 'draw deck'].includes(event.card.location)
                    }),
                    condition: (aggregate) =>
                        aggregate.controller === this.controller &&
                        aggregate.isTyrell &&
                        aggregate.isInHandOrDeck
                }
            },
            limit: ability.limit.perRound(2),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) =>
                    context.events.some((event) => event.card === card)
            },
            message: {
                format: '{player} uses {source} to place {card} in shadows',
                args: { card: (context) => context.target }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.putIntoShadows((context) => ({ card: context.target })),
                    context
                );
            }
        });
    }
}

MargaeryTyrell.code = '25095';

export default MargaeryTyrell;
