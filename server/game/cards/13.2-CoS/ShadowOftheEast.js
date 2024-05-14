const DrawCard = require('../../drawcard.js');

class ShadowOfTheEast extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Select an attachment',
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'attachment'
            },
            handler: (context) => {
                let attachment = context.target;
                attachment.owner.discardCard(attachment);
                this.game.addMessage(
                    '{0} plays {1} to discard {2}',
                    this.controller,
                    this,
                    context.target
                );
                if (
                    this.game
                        .getPlayers()
                        .some((player) => player.activePlot && player.activePlot.hasTrait('Summer'))
                ) {
                    this.game.addMessage(
                        '{0} uses {1} to return {1} to their hand instead of their discard pile',
                        this.controller,
                        this
                    );
                    this.controller.moveCard(this, 'hand');
                }
            }
        });
    }
}

ShadowOfTheEast.code = '13034';

module.exports = ShadowOfTheEast;
