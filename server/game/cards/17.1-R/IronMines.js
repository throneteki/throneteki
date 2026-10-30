import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class IronMines extends DrawCard {
    // Iron Mines (17108)
    // Interrupt: When a character would be killed, if it is not the plot phase, kneel and sacrifice
    // Iron Mines to save that character.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event, context) =>
                    event.allowSave &&
                    event.card.canBeSaved() &&
                    event.card.controller === context.source.controller &&
                    context.game.currentPhase !== 'plot'
            },
            cost: [ability.costs.kneelSelf(), ability.costs.sacrificeSelf()],
            message: {
                format: '{player} kneels and sacrifices {source} to save {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.saveCard((context) => ({ event: context.event }))
        });
    }
}

IronMines.code = '17108';

export default IronMines;
