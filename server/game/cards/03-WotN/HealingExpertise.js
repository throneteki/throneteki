import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HealingExpertise extends DrawCard {
    // Healing Expertise (03044)
    // Interrupt: When a non-Army character you control would be killed, kneel a Maester character
    // to save it.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event, context) =>
                    event.allowSave &&
                    event.card.canBeSaved() &&
                    !event.card.hasTrait('Army') &&
                    event.card.controller === context.source.controller
            },
            location: 'hand',
            cost: ability.costs.kneel(
                (card) => card.hasTrait('Maester') && card.getType() === 'character'
            ),
            message: {
                format: '{player} plays {source} to kneel {costs.kneel} to save {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.saveCard((context) => ({ event: context.event }))
        });
    }
}

HealingExpertise.code = '03044';

export default HealingExpertise;
