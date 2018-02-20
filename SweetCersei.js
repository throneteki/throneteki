const DrawCard = require('../../drawcard.js');

class SweetCersei extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: ({challenge}) => challenge.winner === this.controller && 'intrigue' && !this.controller.cannotGainGold
            },
            handler: () => {
                this.modifyToken('gold', 1);
                this.game.addMessage('{0} uses {1} to place 1 gold from the treasury on {1}', this.controller, this);
            }
        });
    }
}

SweetCersei.code = '08070'; 

module.exports = SweetCersei;
