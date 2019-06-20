const DrawCard = require('../../drawcard.js');

class GuardDuty extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction(
            { faction: 'thenightswatch' }
        );
        this.reaction({
            when: {
                onDeclaredAsDefender: event => event.card === this.parent
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                this.controller.standCard(this.parent);
            }
        });
    }
}

GuardDuty.code = '13046';

module.exports = GuardDuty;
