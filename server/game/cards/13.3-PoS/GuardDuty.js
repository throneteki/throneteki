const DrawCard = require('../../drawcard.js');

class GuardDuty extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'thenightswatch' });
        this.reaction({
            when: {
                onDeclaredAsDefender: event => this.parent && event.card === this.parent && this.parent.kneeled && this.parent.allowGameAction('stand')
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                this.controller.standCard(this.parent);

                this.game.addMessage('{0} kneels {1} to stand {2}', this.controller, this, this.parent);
            }
        });
    }
}

GuardDuty.code = '13046';

module.exports = GuardDuty;
