import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class MargaeryTyrell extends DrawCard {
    // Margaery Tyrell (25095)
    // Renown. Shadow (5).
    // Interrupt: When 1 or more [tyrell] cards are revealed from your hand or deck, choose 1 of
    // those cards and place it in shadows. (Limit twice per round.)
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCardRevealed: {
                    aggregateBy: (event) => ({
                        controller: event.card.controller,
                        isTyrell: event.card.isFaction('tyrell'),
                        isInHandOrDeck: ['hand', 'draw deck'].includes(event.card.location)
                    }),
                    condition: (aggregate, events, context) =>
                        aggregate.controller === context.source.controller &&
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
            gameAction: GameActions.putIntoShadows((context) => ({ card: context.target }))
        });
    }
}

MargaeryTyrell.code = '25095';

export default MargaeryTyrell;
