const DrawCard = require('../../drawcard.js');

class Rhaegal extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCharacterKilled: () => !this.game.claim.isApplying && event.card.controller !== this.controller
            },
            handler: context => {
                context.player.standCard(this);
                this.game.addMessage('{0} stands {1}', context.player, this);
            }
        });
    }
}

Rhaegal.code = '11071';

module.exports = Rhaegal;
