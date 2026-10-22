import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class IronMines extends DrawCard {
    // Iron Mines (02092)
    // Interrupt: When a character would be killed, sacrifice Iron Mines to save that character.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event, context) =>
                    event.allowSave &&
                    event.card.canBeSaved() &&
                    event.card.controller === context.source.controller
            },
            cost: ability.costs.sacrificeSelf(),
            message: {
                format: '{player} sacrifices {source} to save {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.saveCard((context) => ({ event: context.event }))
        });
    }
}

IronMines.code = '02092';

export default IronMines;
