const DrawCard = require('../../drawcard.js');

class SealOfTheHand extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: ['Lord', 'Lady'] });
        this.action({
            title: 'Stand attached character',
            condition: () => this.parent.kneeled,
            cost: ability.costs.kneelSelf(),
            handler: () => {
                this.controller.standCard(this.parent);
                this.game.addMessage('{0} kneels {1} to stand {2}', this.controller, this, this.parent);
            }
        });
    }
}

SealOfTheHand.code = '01032';

module.exports = SealOfTheHand;
