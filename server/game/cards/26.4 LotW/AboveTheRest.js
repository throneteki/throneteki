import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AboveTheRest extends DrawCard {
    // Above the Rest (26072)
    // Reaction: After a character you control gains exactly 1 power, have it gain 1 power. Then, if
    // that character has the House Tully trait, stand it. (Max 1 per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerGained: {
                    aggregateBy: (event) => ({
                        card: event.card
                    }),
                    condition: (aggregate, events, context) =>
                        events.length === 1 &&
                        aggregate.card.controller === context.source.controller &&
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
