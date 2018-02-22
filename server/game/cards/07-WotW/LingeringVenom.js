const DrawCard = require('../../drawcard.js');

class LingeringVenom extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.loser === this.controller
            },
            handler: () => {
                this.modifyToken('venom', 1);
                this.game.addMessage('{0} uses {1} to place a venom token on {1}', this.controller, this);

                if(this.parent.getStrength() <= this.tokens['venom']) {
                    this.parent.controller.killCharacter(this.parent);
                    this.game.addMessage('{0} uses {1} to kill {2}', this.controller, this, this.parent);
                }
            }
        });
    }
}

LingeringVenom.code = '07032';

module.exports = LingeringVenom;
