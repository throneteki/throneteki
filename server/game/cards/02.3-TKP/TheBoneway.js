const DrawCard = require('../../drawcard.js');

class TheBoneway extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.loser === this.controller
            },
            handler: () => {
                this.modifyToken('vengeance', 1);
                this.game.addMessage('{0} places 1 vengeance token on {1}', this.controller, this);
            }
        });

        this.action({
            title: 'Gain 3 power for your faction',
            phase: 'dominance',
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.discardTokenFromSelf('vengeance', 6)
            ],
            handler: () => {
                this.game.addPower(this.controller, 3);
                this.game.addMessage('{0} kneels and discards 6 vengeance tokens from {1} to gain 3 power for their faction',
                    this.controller, this);
            }
        });
    }
}

TheBoneway.code = '02056';

module.exports = TheBoneway;
