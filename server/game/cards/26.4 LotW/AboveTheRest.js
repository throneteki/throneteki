import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AboveTheRest extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerGained: {
                    aggregateBy: (event) => ({
                        card: event.card
                    }),
                    condition: (aggregate, events) =>
                        events.length === 1 &&
                        aggregate.card.controller === this.controller &&
                        aggregate.card.getType() === 'character'
                }
            },
            max: ability.limit.perPhase(1),
            message: {
                format: '{player} plays {source} to have {character} gain 1 power',
                args: { character: (context) => context.aggregate.card }
            },
            gameAction: GameActions.gainPower((context) => ({
                card: context.aggregate.card,
                amount: 1
            })).then((context) => ({
                condition: () => context.aggregate.card.hasTrait('House Tully'),
                message: {
                    format: 'Then, {player} stands {character}',
                    args: { character: (context) => context.parentContext.aggregate.card }
                },
                gameAction: GameActions.standCard((context) => ({
                    card: context.parentContext.aggregate.card
                }))
            }))
        });
    }
}

AboveTheRest.code = '26072';

export default AboveTheRest;
