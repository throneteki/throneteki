const DrawCard = require('../../drawcard.js');

class RobertBaratheon extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerGained: (event) =>
                    event.card === this && this.controller.canGainFactionPower()
            },
            limit: ability.limit.perRound(2),
            handler: () => {
                this.game.addPower(this.controller, 1);
                this.game.addMessage(
                    '{0} uses {1} to gain 1 power for their faction',
                    this.controller,
                    this
                );
            }
        });
    }
}

RobertBaratheon.code = '13107';

module.exports = RobertBaratheon;
