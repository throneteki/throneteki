const DrawCard = require('../../drawcard.js');

class SandSteed extends DrawCard {
    setupCardAbilities() {
        this.attachmentRestriction(
            (card) =>
                card.getType() === 'character' &&
                card.attachments.every(
                    (attachment) => attachment === this || attachment.name !== 'Sand Steed'
                )
        ),
            this.reaction({
                when: {
                    onCardPlaced: (event) =>
                        event.card.hasTrait('Summer') &&
                        event.location === 'revealed plots' &&
                        event.player === this.controller &&
                        this.parent.allowGameAction('gainPower')
                },
                handler: (context) => {
                    this.parent.modifyPower(1);
                    this.game.addMessage(
                        '{0} uses {1} to gain 1 power on {2}',
                        context.player,
                        this,
                        this.parent
                    );
                }
            });
    }
}

SandSteed.code = '08056';

module.exports = SandSteed;
