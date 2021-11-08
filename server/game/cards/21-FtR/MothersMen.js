const DrawCard = require('../../drawcard.js');

class MothersMen extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCharacterKilled: event => !this.game.claim.isApplying && event.card.controller !== this.controller && this.controller.canPutIntoPlay(this)
            },
            location: 'discard pile',
            handler: context => {
                this.controller.putIntoPlay(this);
                this.game.addMessage('{0} puts {1} into play from their discard pile', context.player, this);
            }
        });
    }
}

MothersMen.code = '21020';

module.exports = MothersMen;
