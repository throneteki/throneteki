const DrawCard = require('../../drawcard.js');

class ImprovedFortifications extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ type: 'location' });
        this.interrupt({
            canCancel: true,
            when: {
                onCardLeftPlay: event => event.card === this.parent && this.parent.canBeSaved() && event.allowSave
            },
            cost: ability.costs.sacrificeSelf(),
            handler: context => {
                context.event.cancel();
                this.game.addMessage('{0} sacrifices {1} to save {2}', context.player, this, this.parent);
            }
        });
    }
}

ImprovedFortifications.code = '06066';

module.exports = ImprovedFortifications;
