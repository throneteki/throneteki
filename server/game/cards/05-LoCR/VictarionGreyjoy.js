import DrawCard from '../../drawcard.js';

class VictarionGreyjoy extends DrawCard {
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
