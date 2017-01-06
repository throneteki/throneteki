const DrawCard = require('../../../drawcard.js');

class CerseisWheelhouse extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onFirstPlayerDetermined: (event, player) => this.controller === player
            },
            choices: {
                'Gain 1 gold': () => {
                    this.controller.gold++;
                    this.game.addMessage('{0} uses {1} to gain 1 gold', this.controller, this);
                },
                'Draw 1 card': () => {
                    this.controller.drawCardsToHand(1);
                    this.game.addMessage('{0} uses {1} to draw 1 card', this.controller, this);
                }
            }
        })
    }

    getInitiative() {
        return -1;
    }
}

CerseisWheelhouse.code = '02010';

module.exports = CerseisWheelhouse;
