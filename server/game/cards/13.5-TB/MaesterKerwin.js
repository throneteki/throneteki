import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MaesterKerwin extends DrawCard {
    // Maester Kerwin (13091)
    // Interrupt: When another character would be killed, kill Maester Kerwin to save that
    // character.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event, context) =>
                    event.allowSave &&
                    event.card.canBeSaved() &&
                    event.card.controller === context.source.controller &&
                    event.card !== context.source
            },
            cost: ability.costs.killSelf(),
            message: {
                format: '{player} kills {source} to save {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.saveCard((context) => ({ event: context.event }))
        });
    }
}

MaesterKerwin.code = '13091';

export default MaesterKerwin;
