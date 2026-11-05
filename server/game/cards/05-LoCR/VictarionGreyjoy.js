import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class VictarionGreyjoy extends DrawCard {
    // Victarion Greyjoy (05027)
    // Intimidate. Renown.
    // Interrupt: When Victarion Greyjoy would be killed, discard 2 power from him to save him.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event, context) =>
                    event.allowSave && event.card === context.source && context.source.canBeSaved()
            },
            cost: ability.costs.discardPowerFromSelf(2),
            message: '{player} uses {source} to save {source}',
            gameAction: GameActions.saveCard((context) => ({ event: context.event }))
        });
    }
}

VictarionGreyjoy.code = '05027';

export default VictarionGreyjoy;
