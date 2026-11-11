import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MaesterAemon extends DrawCard {
    // Maester Aemon (01125)
    // No attachments.
    // Interrupt: When a [thenightswatch] character would be killed, kneel Master Aemon to save it.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event, context) =>
                    event.allowSave &&
                    event.card.canBeSaved() &&
                    event.card.isFaction('thenightswatch') &&
                    event.card.controller === context.source.controller
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to save {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.saveCard((context) => ({ event: context.event }))
        });
    }
}

MaesterAemon.code = '01125';

export default MaesterAemon;
