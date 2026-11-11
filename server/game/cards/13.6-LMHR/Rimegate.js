import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RimeGate extends DrawCard {
    // Rimegate (13106)
    // Interrupt: When another location you control would be discarded from play, kneel Rimegate to
    // save it.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCardDiscarded: (event, context) =>
                    event.card !== context.source &&
                    event.card.controller === context.source.controller &&
                    event.card.getType() === 'location' &&
                    event.card.canBeSaved() &&
                    event.allowSave &&
                    event.card.location === 'play area'
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

RimeGate.code = '13106';

export default RimeGate;
