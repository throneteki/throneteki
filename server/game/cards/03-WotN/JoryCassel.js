import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class JoryCassel extends DrawCard {
    // Jory Cassel (03008)
    // Interrupt: When a unique [stark] character you control would be killed, sacrifice Jory Cassel
    // to save it. Then, if there is a Winter plot card revealed, that character gains 1 power.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event, context) =>
                    event.card.controller === context.player &&
                    event.card.isUnique() &&
                    event.card.isFaction('stark')
            },
            cost: ability.costs.sacrificeSelf(),
            message: {
                format: '{player} sacrifices {source} to save {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.saveCard((context) => ({ event: context.event })).then({
                condition: (context) => context.game.anyPlotHasTrait('Winter'),
                message: {
                    format: 'Then {card} gains 1 power',
                    args: { card: (context) => context.parentContext.event.card }
                },
                gameAction: GameActions.gainPower((context) => ({
                    card: context.parentContext.event.card,
                    amount: 1
                }))
            })
        });
    }
}

JoryCassel.code = '03008';

export default JoryCassel;
