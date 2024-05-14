const DrawCard = require('../../drawcard.js');

class HagensDaughter extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    (event.allowSave || event.isBurn) && event.card === this && this.canBeSaved()
            },
            handler: (context) => {
                context.event.saveCard();
                context.player.moveCard(this, 'shadows');
                this.game.addMessage(
                    '{0} saves {1} and returns her to shadows',
                    context.player,
                    this
                );
            }
        });
    }
}

HagensDaughter.code = '11031';

module.exports = HagensDaughter;
