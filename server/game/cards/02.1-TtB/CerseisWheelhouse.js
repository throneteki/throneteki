import DrawCard from '../../drawcard.js';

class CerseisWheelhouse extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onFirstPlayerDetermined: (event) =>
                    this.controller === event.player &&
                    (this.controller.canGainGold() || this.controller.canDraw())
            },
            choices: {
                'Gain 1 gold': () => {
                    if (this.controller.canGainGold()) {
                        this.game.addGold(this.controller, 1);
                        this.game.addMessage('{0} uses {1} to gain 1 gold', this.controller, this);
                    }
                },
                'Draw 1 card': () => {
                    if (this.controller.canDraw()) {
                        this.controller.drawCardsToHand(1);
                        this.game.addMessage('{0} uses {1} to draw 1 card', this.controller, this);
                    }
                }
            }
        });
        this.plotModifiers({
            initiative: -1
        });
    }
}

CerseisWheelhouse.code = '02010';

export default CerseisWheelhouse;
