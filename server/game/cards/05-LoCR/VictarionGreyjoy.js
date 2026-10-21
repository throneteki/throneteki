import DrawCard from '../../drawcard.js';

class VictarionGreyjoy extends DrawCard {
    // Victarion Greyjoy (05027)
    // Intimidate. Renown.
    // Interrupt: When Victarion Greyjoy would be killed, discard 2 power from him to save him.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    event.allowSave && event.card === this && this.canBeSaved()
            },
            cost: ability.costs.discardPowerFromSelf(2),
            handler: (context) => {
                context.event.saveCard();
                this.game.addMessage('{0} uses {1} to save {2}', this.controller, this, this);
            }
        });
    }
}

VictarionGreyjoy.code = '05027';

export default VictarionGreyjoy;
