const DrawCard = require('../../../drawcard.js');

class SerDavosSeaworth extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onChallengeInitiated: event => event.challenge.isStealthSource(this) && 
                                               !event.challenge.getStealthTargetFor(this).isLoyal()
            },
            choices: {
                'Draw 1 card': () => {
                    this.controller.drawCardsToHand(1);
                    this.game.addMessage('{0} uses {1} to draw 1 card', this.controller, this);
                },
                'Gain 1 gold': () => {
                    this.game.addGold(this.controller, 1);
                    this.game.addMessage('{0} uses {1} to gain 1 gold', this.controller, this);
                }
            }
        });
    }
}

SerDavosSeaworth.code = '04087';

module.exports = SerDavosSeaworth;
